import { RewardDataID } from "../../rewards/types/reward-types";

// generate with crypto.randomUUID()
export type CreatureDataID = string;

export enum STATBLOCK_TYPE {
  BODY_PART = "Body Part",
  PHASE = "Phase",
  LAIR = "Lair",
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
    id: CreatureDataID;
  }[];
  version?: string;
  created?: string;
}

// key guard for Creature
export const isLegendary = (creature: any): creature is LegendaryCreature => {
  return creature.legendary;
};

export const isCreature = (creature: any): creature is Creature => {
  return !creature.legendary;
};

// value should be any possible value of the key
export type ChangeValueFunc = (
  key: keyof Creature | "addReward" | "deleteReward",
  value: Creature[keyof Creature],
  index?: number
) => void;
