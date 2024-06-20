import { RewardData } from "../../rewards/types/reward-types";

export interface Shop {
  id: string;
  name: string;
  image: string;
  proprietor: string;
  proprietorImage: string;
  description: string;
  discount: number;
  rewards: RewardData[];
}
