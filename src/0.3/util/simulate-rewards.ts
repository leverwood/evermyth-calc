import { getRandomNum } from "../../util/math";
import { Enemy, PC } from "../types/system-types";
import {
  conditionNotYetApplied,
  initReward,
} from "../../rewards/util/reward-calcs";
import { Reward, STAGE } from "../../rewards/types/reward-types";

export function chooseBestReward(
  actingCreature: PC | Enemy,
  targetCreature?: Enemy | PC,
  options: {
    action?: boolean;
    deals?: boolean;
    heals?: boolean;
    needsCheck?: boolean;
  } = {}
): Reward | null {
  let possibleRewards = [];

  // remove ones you can't afford the cost to
  for (let opt of actingCreature.rewards) {
    const reward = initReward(opt);
    if (reward.cost * Math.max(reward.tier, 0) <= actingCreature.wellspring) {
      possibleRewards.push(reward);
    }
  }

  // TODO: simulate stages better

  // remove ones that don't match the options
  if (options.action)
    possibleRewards = possibleRewards.filter(
      (reward) => reward.stage === STAGE.ACTION
    );
  if (options.action === false)
    possibleRewards = possibleRewards.filter(
      (reward) => reward.stage !== STAGE.ACTION
    );
  if (options.deals)
    possibleRewards = possibleRewards.filter((reward) => reward.deals);
  if (options.deals === false)
    possibleRewards = possibleRewards.filter((reward) => !reward.deals);
  if (options.heals)
    possibleRewards = possibleRewards.filter((reward) => reward.heals);
  if (options.heals === false)
    possibleRewards = possibleRewards.filter((reward) => !reward.heals);
  if (options.needsCheck)
    possibleRewards = possibleRewards.filter(
      (reward) => reward.stage === STAGE.ACTION
    );
  if (options.needsCheck === false)
    possibleRewards = possibleRewards.filter(
      (reward) => reward.stage !== STAGE.ACTION
    );

  // remove those that place conditions which are already active
  possibleRewards = possibleRewards.filter((reward) => {
    if (reward.conditions) {
      const enemy =
        targetCreature?.type === "enemy" ? targetCreature : actingCreature;
      const pc = actingCreature.type === "pc" ? actingCreature : targetCreature;
      return !reward.conditions.some(
        (c) => !conditionNotYetApplied(c, pc as PC, enemy as Enemy)
      );
    }

    return true;
  });

  // pick the ones with the highest tier
  let highestTier = 0;
  for (let reward of possibleRewards) {
    highestTier = Math.max(highestTier, reward.tier);
  }
  possibleRewards = possibleRewards.filter(
    (reward) => reward.tier === highestTier
  );

  // pick random possible reward
  if (!possibleRewards.length) return null;
  return possibleRewards[getRandomNum(0, possibleRewards.length - 1)];
}

export const makeRandomReward = (tier: number, funcs: ((tier: number) => Reward)[]): Reward => {
  const randomFunc = funcs[Math.floor(Math.random() * funcs.length)];
  return randomFunc(tier);
};


