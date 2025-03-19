import { RewardDataID } from "../../rewards/types/reward-types";

// generate with crypto.randomUUID()
export type CreatureDataID = string;

export enum STATBLOCK_TYPE {
  BODY_PART,
  PHASE,
  LAIR,
}

export interface Creature {
  id: CreatureDataID;
  name: string;
  notes?: string;
  description?: string;
  legendary: false;
  tier: number;
  overridePool?: number;
  overrideTarget?: number;
  overrideWellspring?: number;
  rewards: RewardDataID[];
  version?: string;
  created?: string;
}

export interface LegendaryCreature {
  id: CreatureDataID;
  name: string;
  notes: string;
  description: string;
  legendary: true;
  statblocks: {
    type: STATBLOCK_TYPE;
    statblock: Creature;
  }[];
}

// value should be any possible value of the key
export type ChangeValueFunc = (
  key: keyof Creature | "addReward" | "deleteReward",
  value: Creature[keyof Creature],
  index?: number
) => void;
