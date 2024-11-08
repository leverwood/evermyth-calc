import { RewardData, RewardDataID } from "../types/reward-types";

export function getMultiRewards(arr: RewardData[] | RewardDataID[]) {
  return arr.map((item) => {
    if (typeof item === "string") {
      // return getRewardById(item);
    }
  });
}
