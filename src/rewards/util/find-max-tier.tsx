import { initReward } from "./reward-calcs";
import { RewardData } from "../types/reward-types";

export const findMaxTier = (rewards: RewardData[]) => {
  let max = 0;
  rewards.forEach((reward) => {
    const r = initReward(reward);
    if (r.tier > max) max = r.tier;
  });
  return max;
};
