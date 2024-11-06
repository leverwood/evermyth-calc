import { makeEnemyInitiative, makeRandomEnemiesFromPCs } from "./simulate-enemy";
import { getRandomNum } from "../../util/math";
import {
  Enemy,
  PC,
  PCRollOptions,
  Creatures,
  INITIAL_SIMULATION_DATA,
  InitiativeCount,
  RoundData,
  SimulationData,
} from "../types/system-types";
import { getTargetablePCs, getTotalPCTiers } from "./pc-calcs";
import { LOG_LEVEL, Logger } from "../../util/log";
import { randomPCs } from "./simulate-pc";
import { pcTurn } from "./simulate-pc";
import { enemyTurn } from "./simulate-enemy";
import {
  initReward,
  maxDamageReduction,
} from "../../rewards/util/reward-calcs";
import { DiceHandful, PCRoll, isMiss, rollDice } from "./dice-calcs";
import { FLED_AFTER_ROUNDS } from "../../util/constants";

const logger = Logger(LOG_LEVEL.INFO);

export const runSimulations = (
  numSimulations = 100,
  minLevel = 1,
  maxLevel = 20,
  options: PCRollOptions
): SimulationData[] => {
  logger.log("-------------Starting simulations----------------");
  const simulations: SimulationData[] = [];

  for (let i = 0; i < numSimulations; i++) {
    const pcs = randomPCs(minLevel, maxLevel);
    const enemies = makeRandomEnemiesFromPCs(pcs);
    
    const creatures: Creatures = {
      GM: {
        enemies,
        initiative: makeEnemyInitiative(enemies),
      },
      pcs,
    };
    simulations.push(doSimulation(creatures, options));
  }
  return simulations;
};

export const analyzeSimulations = (simulations: SimulationData[]) => {
  if (simulations.length === 0) return null;

  let tpks: SimulationData[] = [],
    wins = 0,
    fleeingSims: SimulationData[] = [],
    pcsDied = 0,
    averageRounds = 0,
    averageDowned = 0,
    averageDownedIfAlive = 0,
    averageHitChance = 0,
    averageHitDoubleChance = 0,
    averageHitTripleChance = 0,
    averageDodgeChance = 0,
    averageDodgeHalfChance = 0,
    longestRounds = 0,
    oneRound = 0;

  let shortestRounds =
    (simulations.length && simulations[0]?.rounds.length) || 999999;

  for (const simulation of simulations) {
    // it's either a TPK or a win
    if (simulation.pcsAlive.length === 0) {
      tpks.push(simulation);
    } else if (simulation.enemiesAlive.length === 0) {
      wins++;
      averageDownedIfAlive += simulation.downed;
    }

    // fled
    if (simulation.pcsFled.length) {
      fleeingSims.push(simulation);
    }

    if (simulation.pcsAlive.length !== simulation.creatures.pcs.length) {
      pcsDied++;
    }
    if (simulation.rounds.length === 1) oneRound++;
    averageRounds += simulation.rounds.length;
    averageDowned += simulation.downed;
    if (simulation.hitRolls)
      averageHitChance += simulation.hitSuccesses / simulation.hitRolls;
    if (simulation.hitRolls)
      averageHitDoubleChance += simulation.hitDouble / simulation.hitRolls;
    if (simulation.hitRolls)
      averageHitTripleChance += simulation.hitTriple / simulation.hitRolls;
    if (simulation.dodgeRolls)
      averageDodgeChance += simulation.dodgeSuccesses / simulation.dodgeRolls;
    if (simulation.dodgeRolls)
      averageDodgeHalfChance +=
        simulation.dodgeHalfSuccesses / simulation.dodgeRolls;
    shortestRounds = Math.min(shortestRounds, simulation.rounds.length);
    longestRounds = Math.max(longestRounds, simulation.rounds.length);
  }

  let lowestLevelTPK = tpks[0];
  for (const tpk of tpks) {
    const totalTiersLowest = getTotalPCTiers(lowestLevelTPK.creatures.pcs);
    const totalTiersCurrent = getTotalPCTiers(tpk.creatures.pcs);
    if (totalTiersCurrent < totalTiersLowest) {
      lowestLevelTPK = tpk;
    }
  }

  return {
    tpks,
    lowestLevelTPK,
    wins,
    oneRound,
    fleeingSims,
    pcsDied,
    averageRounds: averageRounds / simulations.length,
    averageDowned: averageDowned / simulations.length,
    averageDownedIfAlive: averageDownedIfAlive / wins,
    averageHitChance: averageHitChance / simulations.length,
    averageHitDoubleChance: averageHitDoubleChance / simulations.length,
    averageHitTripleChance: averageHitTripleChance / simulations.length,
    averageDodgeChance: averageDodgeChance / simulations.length,
    averageDodgeHalfChance: averageDodgeHalfChance / simulations.length,
    longestRounds,
    longestSims: simulations.filter(
      (sim) => sim.rounds.length === longestRounds
    ),
    shortestRounds,
    shortestSims: simulations.filter(
      (sim) => sim.rounds.length === shortestRounds
    ),
  };
};

// get the pcs going this initiative
const getCurrentInitiative = (initiative: number, creatures: Creatures) => {
  const gmEnemies = creatures.GM.initiative[initiative - 1];
  const pcsGoing = creatures.pcs.filter((pc) => pc.initiative === initiative);
  const gmGoesFirst = getRandomNum(0, 1);
  const going: (PC | Enemy)[] = [];

  if (gmGoesFirst) going.push(...gmEnemies);
  going.push(...pcsGoing);
  if (!gmGoesFirst) going.push(...gmEnemies);

  return going;
};

export const doSimulation = (
  creatures: Creatures,
  options: PCRollOptions
): SimulationData => {
  const snapshot = JSON.parse(JSON.stringify(creatures));
  let pcsAlive = creatures.pcs.filter((p) => !p.dead);
  let {
    hitRolls,
    hitSuccesses,
    hitDouble,
    hitTriple,
    dodgeRolls,
    dodgeSuccesses,
    dodgeHalfSuccesses,
    healRolls,
    healSuccesses,
    downed,
  } = { ...INITIAL_SIMULATION_DATA };
  const rounds = [];

  let round = 1;

  // while there are enemies and pcs hanging around to be hit.
  const targetableEnemies = () =>
    creatures.GM.enemies.filter((e) => e.pool > 0).length;
  const targetablePCs = () => getTargetablePCs(creatures.pcs).length;

  while (targetableEnemies() && targetablePCs() && round <= 100) {
    const roundData: RoundData = {
      round,
      initiative: [],
      enemiesRemain: targetableEnemies(),
      pcsRemain: targetablePCs(),
      enemyPoolRemains: creatures.GM.enemies.reduce(
        (reduced, enemy) => reduced + enemy.pool,
        0
      ),
    };
    rounds.push(roundData);
    round++;

    // loop through initiative
    for (let i = 4; i >= 1; i--) {
      const initiative: InitiativeCount = {
        initiativeCount: i,
        turns: [],
        enemiesRemain: targetableEnemies(),
        pcsRemain: targetablePCs(),
      };
      roundData.initiative.push(initiative);

      const going = getCurrentInitiative(i, creatures);
      if (!going.length) continue;

      // loop through creatures going this round
      for (let j = 0; j < going.length; j++) {
        if (targetableEnemies() === 0 || targetablePCs() === 0) {
          break;
        }
        const creature = going[j];

        if (creature.type === "pc") {
          const turn = pcTurn(
            creature,
            creatures.pcs,
            creatures.GM.enemies,
            options
          );
          if (turn.action?.type === "ATTACK") {
            hitRolls++;
            if (turn.action?.hitTimes) hitSuccesses++;
            if (turn.action?.hitTimes === 2) hitDouble++;
            else if (turn.action?.hitTimes && turn.action?.hitTimes >= 3)
              hitTriple++;
          } else if (turn.action?.type === "HEAL" && turn.action.roll) {
            healRolls++;
            if (turn.action.dealt) healSuccesses++;
          }
          initiative.turns.push(turn);
          continue;
        }

        const turn = enemyTurn(creature, creatures.pcs, options);
        for (let attack of turn.attacked) {
          dodgeRolls++;
          if (attack.fullDodge) dodgeSuccesses++;
          else if (attack.partialDodge) dodgeHalfSuccesses++;
          if (attack.pc.pool <= 0) {
            downed++;
          }
        }
        initiative.turns.push(turn);
      }
    }
  }

  // if all players are down, they will all die
  const playersUp = pcsAlive.filter((p) => p.pool > 0).length;
  if (!playersUp) {
    creatures.pcs.forEach((p) => (p.dead = true));
    pcsAlive = [];
  }

  // if all players flee, remaining players die
  const notFledNotDown = creatures.pcs.filter(
    (pc) => pc.pool > 0 && pc.fledRounds !== FLED_AFTER_ROUNDS
  );
  if (!notFledNotDown.length) {
    creatures.pcs.forEach((pc) => {
      if (pc.pool <= 0) pc.dead = true;
    });
    pcsAlive = [];
  }

  const averagePlayerLevel = Math.round(
    creatures.pcs.reduce((sum, pc) => sum + pc.level, 0) / creatures.pcs.length
  );
  return {
    snapshot,
    creatures,
    averagePlayerLevel,
    rounds,
    enemiesAlive: creatures.GM.enemies.filter((e) => e.pool > 0),
    pcsAlive: creatures.pcs.filter((p) => !p.dead),
    pcsFled: creatures.pcs.filter(
      (p) => !p.dead && p.fledRounds === FLED_AFTER_ROUNDS
    ),
    hitRolls,
    hitSuccesses,
    hitDouble,
    hitTriple,
    dodgeRolls,
    dodgeSuccesses,
    dodgeHalfSuccesses,
    healRolls,
    healSuccesses,
    downed,
  };
};

export function tryReduceDamage(damage: number, victim: PC | Enemy) {
  let drMessage = "";
  let newDamage = damage;
  if (damage < 0) {
    debugger;
    logger.error("tryReduceDamage: got negative damage");
    return {
      newDamage: 0,
      drMessage: "Negative damage",
    };
  }

  if (victim.pool <= 0) {
    debugger;
    logger.error("tryReduceDamage: victim is already downed");
    return { newDamage: damage, drMessage: "Already downed" };
  }

  if (damage < victim.pool) return { newDamage: damage, drMessage };

  const needReduction = damage - victim.pool + 1;
  const reward = victim.rewards.find(
    (opt) =>
      opt.reduceDamage && maxDamageReduction(opt) >= needReduction
  );

  if (reward) {
    let timesUpcast = 0;
    let usedWellspring =
      (reward.cost && reward.cost * initReward(reward).tier) || 0;
    // the amount you are going to reduce so far
    let damageReduction = reward.reduceDamage || 0;

    // TODO: check this still works
    while (
      damageReduction < needReduction &&
      timesUpcast <= (reward.upcastMax || 0)
    ) {
      usedWellspring += 1;
      timesUpcast += 1;
      damageReduction += reward.upcast?.reduceDamage || 0;
    }

    if (victim.wellspring >= usedWellspring) {
      victim.wellspring -= usedWellspring;
      newDamage = damage - needReduction;

      drMessage = `${printCreatureName(victim)} used "${
        reward.name
      }" to reduce damage by ${needReduction}, using ⭐${usedWellspring}.`;
    } else {
      drMessage = `${printCreatureName(victim)} only has ⭐${
        victim.wellspring
      }, not enough to reduce ${damage} damage.`;
    }
  } else {
    drMessage = `${printCreatureName(victim)} doesn't have armor.`;
  }

  if (newDamage < 0) {
    debugger;
    logger.error("tryReduceDamage: Damage is negative");
  }
  return { newDamage, drMessage };
}

export function printCreatureName(creature: PC | Enemy) {
  const enemyType = [
    "Minion",
    "Goblin",
    "Troll",
    "Archmage",
    "Beholder",
    "Dragon",
  ];
  const enemyName =
    creature.type === "enemy" && enemyType[creature.tier]
      ? enemyType[creature.tier]
      : "Enemy";
  return creature.type === "pc"
    ? creature.name
    : `${enemyName} ${creature.number}`;
}

export function makeARoll({
  skillDice = 20,
  mod = 0,
  adv = false,
  dadv = false,
  trained = false,
  fortune = 0,
}) {
  let rollingDice: DiceHandful[] = [{ numDice: 1, sides: skillDice }];
  // TODO: Cancel out advantages and disadvantages
  if (adv && !dadv) {
    rollingDice.push({ numDice: 1, sides: 6 });
  } else if (dadv && !adv) {
    rollingDice.push({ numDice: 1, sides: 6, subtract: true });
  }
  if (trained) {
    rollingDice.push({ numDice: 1, sides: 4 });
  }
  return rollDice(rollingDice, mod);
}

export function tryFortuneToHit(
  pc: PC,
  roll: PCRoll,
  needed: number,
  hadAdv: boolean
) {
  if (!isMiss(roll, needed)) return 0;
  let missedBy = needed - roll.total;
  let usedFortune = 0;

  // grant yourself advantage if you didn't already have it
  if (missedBy > 2 && pc.fortune > 2 && !hadAdv) {
    pc.fortune -= usedFortune;
    usedFortune += 2;
    const { total } = rollDice([{ numDice: 1, sides: 6 }]);
    roll.total += total;
    missedBy = missedBy - total;
  }

  // add fortune straight
  if (missedBy <= pc.fortune) {
    pc.fortune -= missedBy;
    usedFortune += missedBy;
    roll.total += missedBy;
    missedBy = 0;
  }

  return usedFortune;
}
