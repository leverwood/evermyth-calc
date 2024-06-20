import { RewardDataID } from "../../rewards/types/reward-types";

export type HandleModifyPlayerFunc = (
  id: string,
  player: PlayerData,
  action: "add" | "update" | "delete"
) => void;

export interface PlayerData {
  id: string;
  name: string;
  playerName?: string;
  level: number;
  rewards: RewardDataID[];
  // for calculating number of features
  eduMod?: number;
}
