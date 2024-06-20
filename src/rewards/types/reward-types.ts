import { Condition, PC_STATUS } from "../../0.3/types/system-types";
import { ShopCategory } from "../../shops/types/shop-types";

export enum REWARD_TYPE {
  EQUIPMENT = "equipment",
  FEATURE = "feature",
  TRAINING = "training",
  TRINKET = "trinket",
}

// generate with crypto.randomUUID()
export type RewardDataID = string;

interface RewardBase {
  type?: REWARD_TYPE;
  // optional
  advantage?: boolean;
  advantageMsg?: string;
  aoe?: boolean;
  avoidAllies?: boolean;
  castTime?: number;
  castTimeMsg?: string;
  conditions?: Condition[];
  consumable?: boolean;
  cost?: number;
  deals?: number;
  disadvantage?: boolean;
  disadvantageMsg?: string;
  duration?: number;
  durationMsg?: string;
  grantsAbilities?: string[];
  heals?: number;
  instructions?: string;
  isMove?: boolean;
  multiRewards?: RewardData[];
  noAction?: boolean;
  noChase?: boolean;
  noCheck?: boolean;
  notes?: string;
  ranged?: boolean;
  rangeIncrease?: number;
  reduceDamage?: number;
  relentless?: boolean;
  relentlessMsg?: string;
  restrained?: boolean;
  specific?: boolean;
  specificMsg?: string;
  speed?: number;
  stunned?: boolean;
  teleport?: boolean;
  trained?: boolean;
  trainedMsg?: string;
  upcast?: RewardData;
  upcastMax?: number;
  wellspringMax?: number;
  wellspringRecover?: number;
  whileDefending?: boolean;
  summon?: boolean;
  summonTierIncrease?: number;
  price?: number;
}

export interface RewardData extends RewardBase {
  id?: RewardDataID; // the options and the reward should share an ID
  name?: string;
  modifyTier?: number;
  shopCategories?: ShopCategory["slug"][];
}

export interface Reward extends RewardBase {
  __typename: "Reward";
  type: REWARD_TYPE;
  name: string;
  tier: number;
  cost: number;
  deals: number;
  heals: number;
  optionsId?: RewardDataID;
}

export const TEMPORARY_ADV_ACTION: Condition = {
  name: "Advantage on action",
  duration: 1,
  status: PC_STATUS.ADV_ACT,
  ends: "bottom",
};

export const TEMPORARY_ADV_DEFENSE: Condition = {
  name: "Advantage on defense",
  duration: 1,
  status: PC_STATUS.ADV_DEFEND,
  ends: "top",
};

export const OPTION_COST = {
  stunned: 3,
  noAction: 3,
  summon: 3,
  noCheck: 2,
  relentless: 2,
  aoe: 2,
  teleport: 2,
  trained: 2,
  avoidAllies: 1,
  summonTierIncrease: 1,
  deals: 1,
  heals: 1,
  reduceDamage: 1,
  grantsAbilities: 1,
  wellspringMax: 1,
  wellspringRecover: 1,
  restrained: 1,
  speed: 1,
  noChase: 1,
  duration: 1,
  advantage: 1,
  whileDefending: 1,
  rangeIncrease: 1,
  ranged: 0,
  isMove: 0,
  upcast: 0,
  disadvantage: -1,
  cost: -1,
  castTime: -1,
  specific: -1,
  consumable: -2,
} as const;

// type gate for Reward
export function isReward(reward: any): reward is Reward {
  return reward.__typename === "Reward";
}
export type ChangeValueFunc = (
  key:
    | keyof RewardData
    | "addMultiReward"
    | "deleteMultiReward"
    | "addAbility"
    | "deleteAbility"
    | "changeAbility",
  value: number | boolean | string | RewardData,
  index?: number
) => void;
