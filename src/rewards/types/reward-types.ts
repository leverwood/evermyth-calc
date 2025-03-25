import { Condition, PC_STATUS } from "../../0.3/types/system-types";
import { ShopCategory } from "../../shops/types/shop-types";

export enum REWARD_TYPE {
  EQUIPMENT = "equipment",
  FEATURE = "feature",
  TRINKET = "trinket",
  ALLY = "ally",
}

export enum DMG_TYPE {
  STR = "STR",
  AGI = "AGI",
  END = "END",
  EDU = "EDU",
  INS = "INS",
  SOC = "SOC",
  USED = "the pool of the ability you used",
}

export const DMG_TYPE_OPTIONS: {
  [key in DMG_TYPE]: string;
} = {
  [DMG_TYPE.USED]: "the pool of the ability you used",
  [DMG_TYPE.STR]: "STR",
  [DMG_TYPE.AGI]: "AGI",
  [DMG_TYPE.END]: "END",
  [DMG_TYPE.EDU]: "EDU",
  [DMG_TYPE.INS]: "INS",
  [DMG_TYPE.SOC]: "SOC",
} as const;

// generate with crypto.randomUUID()
export type RewardDataID = string;

interface RewardBase {
  type?: REWARD_TYPE;
  stage?: STAGE;
  // optional
  advantage?: boolean;
  advantageMsg?: string;
  aoe?: boolean;
  aoeSizeIncrease?: number;
  avoidAllies?: boolean;
  castTime?: number;
  castTimeMsg?: string;
  conditions?: Condition[];
  consumable?: boolean;
  cost?: number;
  curse?: number;
  curseMsg?: string;
  deals?: number;
  disadvantage?: boolean;
  disadvantageMsg?: string;
  duration?: number;
  durationMsg?: string;
  flavor?: string;
  grantsAbilities?: string[];
  heals?: number;
  instructions?: string;
  lingeringDamage?: number;
  meleeAndRanged?: boolean;
  multiRewards?: RewardData[];
  noChase?: boolean;
  notes?: string;
  onFailTakeDamage?: number;
  onFailDmgType?: DMG_TYPE;
  onAutoSuccess?: boolean;
  onSuccess?: boolean;
  prefix?: string;
  price?: number;
  ranged?: boolean;
  rangeIncrease?: number;
  rangeDecrease?: boolean;
  reduceDamage?: number;
  relentless?: boolean;
  relentlessMsg?: string;
  requiresAmmo?: boolean;
  restrained?: number;
  specific?: boolean;
  specificMsg?: string;
  speed?: number;
  speedType?: string;
  stunned?: number;
  suffix?: string;
  summon?: boolean;
  summonName?: string;
  summonTierIncrease?: number;
  teleport?: boolean;
  tierDecrease?: number;
  tierIncrease?: number;
  trained?: boolean;
  trainedMsg?: string;
  upcast?: RewardData;
  upcastMax?: number;
  wellspringMax?: number;
  wellspringRecover?: number;
  resistant?: [];
  vulnerable?: [];
  immune?: [];
  imposeVulnerable?: [];
  overrideTier?: number;
}

export interface RewardData extends RewardBase {
  id?: RewardDataID; // the options and the reward should share an ID
  name?: string;
  modifyTier?: number;
  shopCategories?: ShopCategory["slug"][];
  frontImg?: string;
  stretchImgY?: boolean;
  padImage?: boolean;
  source?: string;
  version?: string;
  created?: string;
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

export enum STAGE {
  CHECK = "check",
  MOVE = "move",
  DEFENSE = "defense",
  PASSIVE = "passive",
  MINOR = "minor",
  ACTION = "action",
}

export const STAGE_COST: {
  [key in STAGE]: number;
} = {
  [STAGE.CHECK]: 0,
  [STAGE.DEFENSE]: 0,
  [STAGE.MOVE]: 1,
  [STAGE.PASSIVE]: 1,
  [STAGE.ACTION]: 2,
  [STAGE.MINOR]: 2,
} as const;

export const OPTION_COST: {
  [key: string]: number;
} = {
  advantage: 1,
  aoe: 2,
    aoeSizeIncrease: 1,
  avoidAllies: 1,
  castTime: -1,
  consumable: -2,
  cost: -1,
  curse: -1,
  deals: 1,
  disadvantage: -1,
  duration: 1,
  flavor: 0,
  grantsAbilities: 1,
  heals: 1,
  immune: 3,
  imposeVulnerable: 3,
  lingeringDamage: 1,
  meleeAndRanged: 0,
  noChase: 1,
  onFailTakeDamage: -1,
  onAutoSuccess: -1,
  onSuccess: 0,
  prefix: 0,
  ranged: 0,
    rangeDecrease: 0,
  rangeIncrease: 1,
  reduceDamage: 1,
  relentless: 4,
  requiresAmmo: 0,
  restrained: 1,
  resistant: 1,
  specific: -1,
  speed: 1,
  stunned: 3,
  suffix: 0,
  summon: 3,
  summonTierIncrease: 1,
  teleport: 2,
  tierDecrease: -1,
  tierIncrease: 1,
  trained: 1,
  upcast: 0,
  vulnerable: -2,
  wellspringMax: 1,
  wellspringRecover: 1,
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
  value:
    | number
    | boolean
    | string
    | RewardData
    | ShopCategory["slug"][]
    | undefined,
  index?: number
) => void;

// type gate for string[]
export function isStringArray(value: any): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
