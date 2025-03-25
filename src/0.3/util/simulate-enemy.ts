import { getDCToDefend, getPartialDamage } from "./enemy-calc";
import { getRandomNum } from "../../util/math";
import { isMiss } from "./dice-calcs";
import {
  Enemy,
  PC,
  EnemyTurnData,
  EnemyAttackData,
  PCRollOptions,
} from "../types/system-types";
import { getMaxMod, getTargetablePCs, hasAdv } from "./pc-calcs";
import {
  decrementConditionDurations,
  getWellspringCost,
} from "../../rewards/util/reward-calcs";
import {
  makeStandardAoE,
  makeStandardArmor,
  makeStandardSpell,
  makeStandardWeapon,
} from "../../rewards/util/reward-make";
import { makeARoll, tryFortuneToHit } from "./simulate";
import { tryReduceDamage } from "./simulate";
import { chooseBestReward, makeRandomReward } from "./simulate-rewards";
import { getTier } from "../../util/calcs";
import { getEnemyPool, getEnemyWellspring } from "./enemy-calc";
import { shuffleArray } from "../../util/array";
import { LOG_LEVEL, Logger } from "../../util/log";

const logger = Logger(LOG_LEVEL.WARN);

export function chooseVictims(pcs: PC[]): PC[] {

  const targetablePCs = getTargetablePCs(pcs);
  const pcsNotFleeing = shuffleArray(targetablePCs.filter((p) => !p.fleeing));
  const pcsFleeing = shuffleArray(targetablePCs.filter((p) => p.fleeing));

  const numVictims = getRandomNum(2, 4);

  // start with the pcs that are alive and not fleeing
  const victims = pcsNotFleeing.slice(
    0,
    Math.min(numVictims, pcsNotFleeing.length)
  );

  // add fleeing pcs if we need more
  const remaining = numVictims - victims.length;
  victims.push(...pcsFleeing.slice(0, Math.min(remaining, pcsFleeing.length)));

  victims.forEach((v) => {
    if(v.pool <= 0) {
      debugger;
      logger.error(`PC ${v.name} is downed, should not be targetable`);
    }
  });
  return victims;
}

export const enemyTurn = (
  enemy: Enemy,
  pcs: PC[],
  options: PCRollOptions
): EnemyTurnData => {
  decrementConditionDurations("top", enemy);

  const turn: EnemyTurnData = {
    type: "enemy_turn",
    enemy,
    snapshot: JSON.parse(JSON.stringify(enemy)),
    attacked: [],
    action: "ATTACK",
    message: "",
  };

  const skipAllEnemyTurns = false;
  if (skipAllEnemyTurns) {
    turn.action = "SKIP";
    turn.message = "TEMP: Skip all enemy turns";
    return turn;
  }

  // dead
  if (enemy.pool <= 0) {
    turn.action = "SKIP";
    turn.message = "Dead";
    return turn;
  }

  // no one to target
  const targetablePCs = getTargetablePCs(pcs);
  if (targetablePCs.length === 0) {
    turn.action = "SKIP";
    turn.message = "No targetable PCs";
    return turn;
  }

  let message = "";
  let pcsToAttack = chooseVictims(pcs);
  const reward = chooseBestReward(enemy, pcsToAttack[0], {
    deals: true,
    action: true,
  });

  if (!reward) {
    logger.error("No reward found for enemy attack");
    turn.message = "No reward found";
    return turn;
  }
  turn.usedReward = reward;

  // always spend wellspring even if it fails
  enemy.wellspring -= getWellspringCost(reward);
  if (!reward.aoe) {
    pcsToAttack = [pcsToAttack[0]];
  }

  // Assemble dice
  const needed = getDCToDefend(enemy.tier);

  const attacks = pcsToAttack.map((pc) => {
    if (pc.pool <= 0) {
      debugger;
      logger.error(`PC ${pc.name} is downed, should not be targetable`);
    }

    // TODO: what if enemy has a no check reward?
    logger.debug(`${pc.name} is making defense roll`);
    const advConditions = hasAdv("defense", pc.conditions, enemy.conditions);
    const advantage = advConditions.rollWith === "ADV" || options.advToDefend;
    const roll = makeARoll({
      mod: getMaxMod(pc.level),
      adv: advantage,
      dadv: advConditions.rollWith === "DADV",
      trained: options.trainedToDefend,
    });
    let usedFortune = tryFortuneToHit(pc, roll, needed, advantage);
    usedFortune += tryFortuneToHit(pc, roll, needed * 2, true);
    let fullDodge = false;
    let partialDodge = false;
    let damage = 0;

    // pcs miss to dodge, take full damage
    if (isMiss(roll, needed)) {
      damage = reward.deals;
      pc.fortune++;
    }

    // hit double+, take zero
    else if (Math.floor(roll.total / needed) >= 2) {
      damage = 0;
      fullDodge = true;
    }

    // hit normal, take half damage
    else {
      damage = getPartialDamage(reward.deals);
      partialDodge = true;
    }

    // check if player is immune to damage
    const hasImmunity =
      pc.rewards.some((r) => r.immune?.length) && getRandomNum(1, 10) === 1;
    const hasResistance =
      pc.rewards.some((r) => r.resistant?.length) && getRandomNum(1, 10) === 1;
    const hasVulnerability =
      pc.rewards.some((r) => r.vulnerable?.length) && getRandomNum(1, 10) === 1;

    const { newDamage, drMessage } = tryReduceDamage(damage, pc);
    message += drMessage;
    damage = newDamage;

    if (hasImmunity) {
      message += `${pc.name} is immune to this type of damage`;
      damage = 0;
    }
    if (hasResistance) {
      message += `${pc.name} has resistance to this type of damage`;
      damage = Math.floor(damage / 2);
    }
    if (hasVulnerability) {
      message += `${pc.name} has vulnerability to this type of damage`;
      damage = damage * 2;
    }

    if (damage < 0) {
      console.error("How did I get here? Damage should not be less than zero.");
      damage = 0;
    }

    pc.pool -= damage;
    if (pc.pool <= 0) {
      pc.pool = 0;
      targetablePCs.splice(targetablePCs.indexOf(pc), 1);
    }

    const attackAction: EnemyAttackData = {
      pc,
      damage,
      fullDodge,
      partialDodge,
      roll,
      needed,
      crit: roll.autoWin,
      usedFortune,
      downed: pc.pool <= 0,
      pcPool: pc.pool,
      message,
    };
    return attackAction;
  });

  turn.attacked.push(...attacks);

  decrementConditionDurations("bottom", enemy);

  return turn;
};

export function makeRandomEnemiesFromPCs(pcs: PC[]) {
  const totalTiers = pcs.reduce((acc, pc) => acc + getTier(pc.level), 0);
  const numPCs = pcs.length;
  const maxPCLevel = Math.max(...pcs.map((pc) => pc.level));
  const enemyTiers = makeRandomEnemyTiers(totalTiers, numPCs, maxPCLevel);
  const enemyCreatures: Enemy[] = enemyTiers.map((enemyTier, i) =>
    makeRandomEnemy(enemyTier, i)
  );
  return enemyCreatures;
}

export function makeRandomEnemyTiers(
  totalTiers: number,
  numPCs: number,
  maxPCLevel: number
) {
  const maxEnemyTier = getTier(maxPCLevel) + 0.5;
  const maxEnemiesCount = numPCs * 2;

  // add tier 1+ enemies
  let remainingTiers = totalTiers;
  let enemies = [];
  while (remainingTiers > 0 && enemies.length < maxEnemiesCount) {
    const lastEnemy = enemies.length === maxEnemiesCount - 1;

    // if it's the last enemy, try to fill it out
    let minLevel = lastEnemy ? Math.min(remainingTiers, maxEnemyTier) : 1;
    const randomDoubleTier = getRandomNum(
      minLevel,
      Math.min(maxEnemyTier, remainingTiers) * 2
    );
    const tier = randomDoubleTier / 2;

    remainingTiers -= tier;
    enemies.push(tier);
  }

  if (enemies.length === maxEnemiesCount) {
    return enemies;
  }

  // add tier 0 enemies
  const maxTier0 = maxEnemiesCount - enemies.length;
  const numTier0 = getRandomNum(0, maxTier0);
  for (let i = 0; i < numTier0; i++) {
    enemies.push(0);
  }
  return enemies;
}

export const makeRandomEnemy = (enemyTier: number, i: number): Enemy => ({
  type: "enemy",
  tier: enemyTier,
  pool: getEnemyPool(enemyTier),
  number: i + 1,
  conditions: [],
  rewards: makeEnemyRewards(enemyTier),
  wellspring: getEnemyWellspring(enemyTier),
});

function possibleRewards(tier: number) {
  if (tier > 0) {
    return shuffleArray([
      makeStandardAoE,
      makeStandardSpell,
      makeStandardArmor,
    ]);
  } else return shuffleArray([makeStandardSpell]);
}

export function makeEnemyRewards(enemyTier: number) {
  const rewardTier = Math.max(0, Number.isInteger(enemyTier) ? enemyTier - 1 : Math.floor(enemyTier));
  const randomRewardTier = getRandomNum(0, Math.max(0, rewardTier - 1));
  const rewards = [
    makeStandardWeapon(rewardTier),
    makeRandomReward(rewardTier, possibleRewards(rewardTier)),
    makeRandomReward(randomRewardTier, possibleRewards(randomRewardTier)),
  ];
  return rewards;
}

// TODO: Rewrite to support half tiers
export function makeEnemyInitiative(enemies: Enemy[]) {
  // group enemies into tiers
  const groups: Enemy[][] = [enemies];
  // for (const enemy of enemies) {
  //   if (!groups[enemy.tier]) groups[enemy.tier] = [];
  //   groups[enemy.tier].push(enemy);
  // }

  // give each group an initiative
  const initiatives: {
    enemies: Enemy[];
    initiative: number;
  }[] = [];
  for (let i = 0; i < groups.length; i++) {
    if (groups[i]) {
      initiatives.push({
        enemies: groups[i],
        initiative: getRandomNum(0, 3),
      });
    }
  }

  const initiative: Enemy[][] = [[], [], [], []];
  for (const { enemies, initiative: init } of initiatives) {
    initiative[init].push(...enemies);
  }
  return initiative;
}