import { RewardDataID } from "../../rewards/types/reward-types";

export type HandleModifyPlayerFunc = (
  index: number,
  player: PlayerData,
  action: "add" | "update" | "delete"
) => void;

export interface PlayerData {
  name: string;
  playerName?: string;
  level: number;
  rewards: RewardDataID[];
  // for calculating number of features
  eduMod?: number;
}
