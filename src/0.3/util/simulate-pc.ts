import { getRandomNum } from "../../util/math";
import {
  Condition,
  Enemy,
  PC,
  PCAction,
  PCAttackData,
  PCRollOptions,
  PCTurnData,
  isEnemyStatus,
} from "../types/system-types";
import {
  getPCWellspring,
  getPCRandomPool,
  getTargetablePCs,
  hasAdv,
} from "./pc-calcs";
import {
  decrementConditionDurations,
  getRewardDC,
  getWellspringCost,
} from "../../rewards/util/reward-calcs";
import {
  makeAdvGranter,
  makeHealingSpell,
  makePotionOfHealing,
  makeStandardAoE,
  makeStandardArmor,
  makeStandardSpell,
  makeStandardWeapon,
} from "../../rewards/util/reward-make";
import { names } from "./pc-calcs";
import { shuffleArray } from "../../util/array";
import { makeARoll, tryFortuneToHit, tryReduceDamage } from "./simulate";
import { getTier } from "../../util/calcs";
import { FLED_AFTER_ROUNDS } from "../../util/constants";
import { getDCToHitEnemy } from "./enemy-calc";
import { chooseBestReward } from "./simulate-rewards";
import { LOG_LEVEL, Logger } from "../../util/log";
import {
  TEMPORARY_ADV_ACTION,
  TEMPORARY_ADV_DEFENSE,
  Reward,
  STAGE,
} from "../../rewards/types/reward-types";

const logger = Logger(LOG_LEVEL.WARN);

export const randomPC = (
  i: number,
  level: number,
  pcNames: string[] = names
): PC => {
  const wellspring = getRandomNum(0, getPCWellspring(level));
  const startingPool = getPCRandomPool(level);
  return {
    type: "pc",
    name: pcNames[i],
    level: level,
    initiative: getRandomNum(1, 4),
    pool: startingPool,
    startingPool: startingPool,
    number: i + 1,
    startingWellspring: wellspring,
    wellspring: wellspring,
    fortune: getRandomNum(1, 2),
    fledRounds: 0,
    conditions: [],
    rewards: makeRandomPlayerRewards(level),
    deathFails: 0,
    dead: false,
  };
};

export const randomPCs = (minLevel = 1, maxLevel = 20) => {
  const pcNames = shuffleArray(names);
  const numPCs = getRandomNum(3, 7);
  const pcs: PC[] = [];
  let currentLevel = getRandomNum(minLevel, maxLevel);
  for (let i = 1; i <= numPCs; i++) {
    pcs.push(randomPC(i, currentLevel, pcNames));
    currentLevel = Math.max(
      minLevel,
      Math.min(maxLevel, currentLevel + getRandomNum(-1, 1))
    );
  }
  return pcs;
};
function pcHealAction(pc: PC, downPC: PC, options: PCRollOptions): PCAction {
  // find a reward to use
  const reward = chooseBestReward(pc, undefined, {
    heals: true,
  });

  if (!reward) {
    logger.error(
      `No rewards available to use for healing. This shouldn't happen.`
    );
    return {
      type: "SKIP",
      message: "No rewards available to use.",
    };
  }

  let roll;
  // TODO: Upcasting changes hit target
  let needed = getRewardDC(reward);
  let usedFortune = 0;

  const getHits = () => {
    if (
      reward.stage === STAGE.MINOR ||
      reward.stage === STAGE.MOVE ||
      reward.stage === STAGE.PASSIVE
    ) {
      return 1;
    }

    // Roll the dice
    const advConditions = hasAdv("action", pc.conditions, []);
    const advantage = options.advToHeal || advConditions.rollWith === "ADV";
    roll = makeARoll({
      mod: getTier(pc.level),
      adv: advantage,
      dadv: advConditions.rollWith === "DADV",
      trained: options.trainedToHeal,
    });
    usedFortune += tryFortuneToHit(pc, roll, needed, advantage);
    let hits = Math.floor(roll.total / needed);

    // auto win and auto fail
    if (roll.autoWin && !hits) hits = 1;
    if (roll.autoFail) hits = 0;

    if (!hits) pc.fortune++;
    return hits;
  };

  const hits = getHits();
  const healTotal = reward.heals * hits; // TODO: upcast
  let usedWellspring = hits ? getWellspringCost(reward) || 0 : 0;

  if (healTotal) {
    downPC.pool += healTotal;
    downPC.deathFails = 0;
  }
  pc.wellspring -= usedWellspring;

  if (reward.consumable) {
    pc.rewards = pc.rewards.filter((r) => r !== reward);
  }

  return {
    type: "HEAL",
    roll,
    needed,
    usedFortune,
    usedReward: reward,
    dealt: healTotal,
    usedWellspring,
    withPCs: [downPC],
  };
}
const pcShouldFlee = (pc: PC, pcs: PC[], pcsWillFlee: boolean) => {
  if (!pcsWillFlee) return false;
  if (pc.fleeing) return true;

  // if somebody runs, everybody runs
  const pcsFleeing = pcs.filter((p) => p.fleeing);
  if (pcsFleeing.length) return true;

  // if half the pcs are down, and everyone else is less than half health, abandon ship!
  const pcsAlive = pcs.filter((p) => p.pool > 0);
  const halfDown = pcsAlive.length <= pcs.length / 2;
  const pcsWithHighPool = pcsAlive.filter((p) => p.pool > p.startingPool / 2);
  return halfDown && pcsWithHighPool.length === 0;
};

export const pcTurn = (
  pc: PC,
  pcs: PC[],
  enemies: Enemy[],
  options: PCRollOptions
): PCTurnData => {
  decrementConditionDurations("top", pc);
  const snapshot = JSON.parse(JSON.stringify(pc));

  const skipAllPCTurns = false;
  if (skipAllPCTurns) {
    const act: PCAction = {
      type: "SKIP",
      message: "Skip all PC turns.",
    };
    return {
      type: "pc_turn",
      pc,
      snapshot,
      interaction: act,
      action: act,
    };
  }

  // all enemies down
  const enemiesAlive = enemies.filter((e) => e.pool > 0);
  if (enemiesAlive.length === 0) {
    const act: PCAction = {
      type: "SKIP",
      message: "No enemies left to attack.",
    };
    return {
      type: "pc_turn",
      pc,
      snapshot,
      interaction: act,
      action: act,
    };
  }

  // has already fled
  if (pc.fledRounds >= FLED_AFTER_ROUNDS) {
    const act: PCAction = {
      type: "SKIP",
      message: "Already fled.",
    };
    return {
      type: "pc_turn",
      pc,
      snapshot,
      interaction: act,
      action: act,
    };
  }

  // do a death save
  let deathSave;
  if (!pc.dead && pc.pool <= 0) {
    deathSave = getRandomNum(1, 20);
    if (deathSave === 20) {
      pc.pool = 1;
      pc.deathFails = 0;
    } else {
      pc.deathFails += deathSave === 1 ? 2 : 1;
      if (pc.deathFails >= 3) {
        pc.dead = true;
      }
    }
  }

  // dead
  if (pc.dead) {
    const act: PCAction = {
      type: "SKIP",
      message: "Dead.",
    };
    return {
      type: "pc_turn",
      pc,
      snapshot,
      interaction: act,
      action: act,
      deathSave,
    };
  }

  // downed
  if (!pc.dead && pc.pool <= 0) {
    const act: PCAction = {
      type: "SKIP",
      message: "Down.",
    };
    return {
      type: "pc_turn",
      pc,
      snapshot,
      interaction: act,
      action: act,
      deathSave,
    };
  }

  const result: PCTurnData = {
    type: "pc_turn",
    pc,
    snapshot,
    interaction: pcInteraction(pc, pcs, enemies, options),
    action: pcAction(pc, pcs, enemies, options),
    deathSave,
  };
  // TODO: When should this decrement so that it makes sense
  decrementConditionDurations("bottom", pc);
  return result;
};
const pcShouldHeal = (pc: PC, pcs: PC[]) => {
  const downPC = pcs.find((p) => p.pool <= 0);
  const healingRewards = chooseBestReward(pc, undefined, {
    heals: true,
  });
  if (downPC && healingRewards) {
    return downPC;
  }
  return false;
};
function pcAction(
  pc: PC,
  pcs: PC[],
  enemies: Enemy[],
  options: PCRollOptions
): PCAction {
  // no enemies left
  const enemiesAlive = enemies.filter((e) => e.pool > 0);

  // flee
  if (pcShouldFlee(pc, pcs, options.pcsWillFlee)) {
    pc.fleeing = true;
    pc.fledRounds++;
    return {
      type: "FLEE",
    };
  }

  // if a PC is down, heal them
  const downPC = pcShouldHeal(pc, pcs);
  if (downPC) {
    return pcHealAction(pc, downPC, options);
  }

  // the enemy to attack
  let enemiesToAttack = shuffleArray(enemiesAlive).slice(0, getRandomNum(1, 3));

  // pick a reward to use
  const reward = chooseBestReward(pc, enemiesToAttack[0], {
    deals: true,
    action: true,
  });
  if (!reward) {
    return {
      type: "SKIP",
      message: "No rewards available to use.",
    };
  }

  let rewardMessage = "";
  const killed: Enemy[] = [];
  const printEnemies =
    "enemy" + enemiesToAttack.map((e) => e.number).join(", ");

  if (!reward.aoe) {
    enemiesToAttack = [enemiesToAttack[0]];
  }

  // apply conditions
  if (reward?.conditions) {
    reward.conditions.forEach((c: Condition) => {
      if (isEnemyStatus(c.status)) {
        enemiesToAttack.forEach((e) => e.conditions.push({ ...c }));
        rewardMessage += `Imposed "${c.name}" on ${printEnemies}. `;
      } else {
        pc.conditions.push({ ...c });
        rewardMessage += `Gained ${c.name}. `;
      }
    });
  }

  // Roll the dice
  const advConditions = hasAdv(
    "action",
    pc.conditions,
    enemiesToAttack[0].conditions
  );
  const advantage = advConditions.rollWith === "ADV" || options.advToHit;
  const roll = makeARoll({
    mod: getTier(pc.level),
    adv: advantage,
    dadv: advConditions.rollWith === "DADV",
    trained: options.trainedToHit,
  });
  const needed =
    enemiesToAttack.length === 0
      ? getDCToHitEnemy(enemiesToAttack[0].tier)
      : getRewardDC(reward);
  let usedFortune = tryFortuneToHit(pc, roll, needed, advantage);
  usedFortune += tryFortuneToHit(pc, roll, needed * 2, true);

  // spend wellspring to increase my damage
  // TODO: factor in AoE
  const baseDamage = reward?.deals;
  let usedWellspring = reward?.cost * reward?.tier || 0;

  let hits = Math.floor(roll.total / needed);
  if (!hits && roll.autoWin) hits = 1;
  if (roll.autoFail) hits = 0;

  // check if fortune changes the hit into a miss
  if (!hits && needed - roll.total <= pc.fortune) {
    hits = 1;
    pc.fortune -= needed - roll.total;
  }

  // only use wellspring if you hit
  if (hits && usedWellspring) {
    pc.wellspring -= usedWellspring;
  } else {
    usedWellspring = 0;
  }

  // figure out if they are vulnerable to the damage
  const isVulnerable = reward.imposeVulnerable && getRandomNum(1, 10) === 1;

  // calculate damage
  let damage = hits ? hits * baseDamage : 0;
  if (isVulnerable) damage *= 2;

  const againstEnemies: PCAttackData[] = enemiesToAttack.map((enemy) => {
    const { newDamage, drMessage } = tryReduceDamage(damage, enemy);
    if (hits) enemy.pool -= newDamage;
    if (enemy.pool <= 0) {
      enemy.pool = 0;
      enemiesAlive.splice(enemiesAlive.indexOf(enemy), 1);
      killed.push(enemy);
    }
    return {
      enemy,
      damage: newDamage,
      pool: enemy.pool,
      message: `${newDamage} damage to enemy ${enemy.number}. ${drMessage}`,
    };
  });

  return {
    type: "ATTACK",
    roll,
    needed,
    usedWellspring,
    hitTimes: hits,
    killed,
    dealt: damage,
    againstEnemies,
    usedReward: reward,
    usedFortune,
    message: `${rewardMessage}`.trim(),
  };
}

function pcInteraction(
  pc: PC,
  pcs: PC[],
  enemies: Enemy[],
  options: PCRollOptions
): PCAction {
  if (!options.doInteraction) {
    return {
      type: "SKIP",
      message: "No interactions allowed.",
    };
  }

  // give someone else advantage on their action if they need it
  const pcsNeedAdvAction = getTargetablePCs(pcs).filter((p) => {
    if (p.number === pc.number) return false;
    const advConditions = hasAdv("action", p.conditions, []);
    return advConditions.rollWith !== "ADV" && !p.fleeing;
  });
  if (pcsNeedAdvAction.length) {
    logger.debug(
      `Giving ${pcsNeedAdvAction[0].name} advantage on their next action.`
    );
    pcsNeedAdvAction[0].conditions.push({ ...TEMPORARY_ADV_ACTION });
    return {
      type: "HELP",
      message: `Grants ${pcsNeedAdvAction[0].name} advantage on their next action.`,
      withPCs: [pcsNeedAdvAction[0]],
    };
  }
  logger.debug("No pcs need advantage on their action.");

  // give someone else advantage on their defense if they need it
  const pcsNeedAdvDefense = getTargetablePCs(pcs).filter((p) => {
    if (p.number === pc.number) return false;
    const advConditions = hasAdv("defense", p.conditions, []);
    return advConditions.rollWith !== "ADV" && !p.fleeing;
  });
  if (pcsNeedAdvDefense.length) {
    pcsNeedAdvDefense[0].conditions.push({ ...TEMPORARY_ADV_DEFENSE });
    logger.debug(
      `${pc.name} grants ${pcsNeedAdvDefense[0].name} adv on next defense`,
      pc,
      pcsNeedAdvDefense[0]
    );
    return {
      type: "HELP",
      message: `Grants ${pcsNeedAdvDefense[0].name} advantage on their next defense.`,
      withPCs: [pcsNeedAdvDefense[0]],
    };
  }

  return {
    type: "OTHER",
    message: "PC interacts with the environment.",
  };
}

function possibleRewards(tier: number){
  if(tier > 0){
    return shuffleArray([
      makeStandardWeapon,
      makeStandardAoE,
      makeStandardSpell,
      makeAdvGranter,
      makeStandardArmor,
      makePotionOfHealing,
      makeHealingSpell,
    ])
  }
  else return shuffleArray([
    makeStandardWeapon,
    makeStandardSpell,
    makeAdvGranter,
    makePotionOfHealing,
    makeHealingSpell,
  ]);
}

export function makeRandomPlayerRewards(level: number): Reward[] {
  const weapon = makeStandardWeapon(getTier(level) - 1);
  const tier0HealingPot = makePotionOfHealing(0);
  const rewards: Reward[] = [weapon];
  if (getTier(level) < 2) rewards.push(tier0HealingPot);

  // get rewards for previous levels
  let currentTier = getTier(level);
  let currentRewardArray = possibleRewards(currentTier);
  for (let i = level - 1; i > 0; i--) {
    if (currentTier !== getTier(i)) {
      currentTier = getTier(i);
      currentRewardArray = possibleRewards(currentTier);
    }
    const index = i % 4;
    rewards.push(currentRewardArray[index](currentTier));
  }
  return rewards;
}

