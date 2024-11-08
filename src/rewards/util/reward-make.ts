import { initReward } from "./reward-calcs";

import { Reward, RewardData, STAGE } from "../types/reward-types";
import {
  Condition,
  PC_STATUS,
  ENEMY_STATUS,
} from "../../0.3/types/system-types";
import { LOG_LEVEL, Logger } from "../../util/log";

const logger = Logger(LOG_LEVEL.INFO);

export const makeStandardWeapon = (tier: number): Reward => {
  const reward = initReward({
    name: `T${tier} Weapon`,
    deals: 1 + tier,
  });
  if (reward.tier !== tier)
    logger.error(
      `makeStandardWeapon: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};

export const makeStandardArmor = (tier: number): Reward => {
  if (tier < 1) {
    logger.error(`makeStandardArmor: tier must be at least 1, got ${tier}`);
  }
  const reward = initReward({
    name: `T${tier} Armor`,
    stage: STAGE.DEFENSE,
    deals: 0,
    reduceDamage: 1,
    cost: 1,
    upcast: initReward({
      name: `T${tier} Armor Upcast`,
      reduceDamage: 1,
    }),
    upcastMax: tier - 1,
  });
  if (reward.tier !== tier)
    logger.error(
      `makeStandardArmor: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};
// scales with tier

export const makeStandardSpell = (tier: number): Reward => {
  const reward = initReward({
    name: `T${tier} Spell`,
    deals: 1 + tier + tier,
    cost: 1,
  });
  if (reward.tier !== tier)
    console.error(
      `makeStandardSpell: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};

export const makeStandardAoE = (tier: number): Reward => {
  if (tier < 1) {
    logger.error(`makeStandardAoE: tier must be at least 1, got ${tier}`);
  }
  const reward = initReward({
    name: `T${tier} AoE Spell`,
    deals: tier + tier - 1,
    cost: 1,
    aoe: true,
  });
  if (reward.tier !== tier)
    logger.error(
      `makeStandardAoE: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};

export const makeAdvGranter = (tier: number): Reward => {
  const possibilities: Condition[] = [
    {
      name: "Advantage on action rolls",
      status: PC_STATUS.ADV_ACT,
      duration: tier,
      ends: "bottom",
    },
    {
      name: "Advantage on defense rolls",
      status: PC_STATUS.ADV_DEFEND,
      duration: tier,
      ends: "top",
    },
  ];

  const reward = initReward({
    name: `T${tier} Advantage Granter`,
    deals: 1 + tier,
    cost: 1,
    conditions: [
      possibilities[Math.floor(Math.random() * possibilities.length)],
    ],
  });
  if (reward.tier !== tier)
    console.error(
      `makeAdvGranter: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};
// impose bad stuff on enemies
// TODO: This doesn't scale to any tier well, because the duration doubles the cost

export const makeDisadvImposer = (tier: number): Reward => {
  // advantage on action rolls for tier rounds (+tier)
  // cost tier wellspring (-tier)
  // deal tier amount of damage (+tier)
  const possibilities: Condition[] = [
    {
      name: "Temporary advantage on defense rolls against",
      status: ENEMY_STATUS.ADV_DEFEND_AGAINST,
      duration: tier,
      ends: "bottom",
    },
    {
      name: "Temporary advantage to act against",
      status: ENEMY_STATUS.ADV_ACT_AGAINST,
      duration: tier,
      ends: "top",
    },
  ];

  const reward = initReward({
    name: `T${tier} Disadvantage Imposer`,
    deals: 1 + tier,
    cost: 1,
    conditions: [
      possibilities[Math.floor(Math.random() * possibilities.length)],
    ],
  });
  if (reward.tier !== tier)
    console.error(
      `makeDisadvImposer: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};

export const makePotionOfHealing = (tier: number): Reward => {
  const reward = initReward({
    name: `T${tier} Potion of Healing`,
    deals: 0,
    consumable: true,
    stage: STAGE.ACTION,
    heals: tier + 1,
  });
  if (reward.tier !== tier)
    console.error(
      `makePotionOfHealing: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};

export const makeHealingSpell = (tier: number): Reward => {
  if (tier < 1) {
    logger.error(`makeHealingSpell: tier must be at least 1, got ${tier}`);
  }
  const reward = initReward({
    name: `T${tier} Healing Spell`,
    deals: 0,
    heals: 1 + tier + tier,
    cost: 1,
  });
  if (reward.tier !== tier)
    console.error(
      `makeHealingSpell: tier mismatch. Expected ${tier}, got ${reward.tier}`
    );
  return reward;
};
export const getRewardsFromStorage = () => {
  const rewards = localStorage.getItem("rewards")
    ? JSON.parse(localStorage.getItem("rewards") as string)
    : ([] as RewardData[]);
  if (!Array.isArray(rewards)) {
    logger.error("Rewards is not an array", rewards);
    return [];
  }
  logger.debug("getRewardsFromStorage", rewards);

  // ensure they all have IDs if they don't already
  rewards.forEach((r) => {
    if (!r.id) r.id = crypto.randomUUID();
  });

  return rewards;
};
