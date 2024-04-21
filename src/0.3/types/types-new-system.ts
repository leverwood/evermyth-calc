import { PCRoll } from "../util/dice-calcs";
import { RewardOptions, Reward } from "./reward-types-new";


export const INITIAL_SIMULATION_DATA: SimulationData = {
  rounds: [],
  creatures: {
    GM: {
      enemies: [],
      initiative: [],
    },
    pcs: []
  },
  snapshot: {
    GM: {
      enemies: [],
      initiative: [],
    },
    pcs: []
  },
  averagePlayerLevel: 0,
  pcsFled: [],
  pcsAlive: [],
  enemiesAlive: [],
  hitRolls: 0,
  hitSuccesses: 0,
  hitDouble: 0,
  hitTriple: 0,
  dodgeRolls: 0,
  dodgeSuccesses: 0,
  dodgeHalfSuccesses: 0,
  healRolls: 0,
  healSuccesses: 0,
  downed: 0,
};

export interface SimulationData {
  rounds: RoundData[];
  creatures: Creatures;
  averagePlayerLevel: number;
  snapshot: Creatures;
  pcsFled: PC[];
  pcsAlive: PC[];
  enemiesAlive: Enemy[];
  hitRolls: number;
  hitSuccesses: number;
  hitDouble: number;
  hitTriple: number;
  dodgeRolls: number;
  dodgeSuccesses: number;
  dodgeHalfSuccesses: number;
  healRolls: number;
  healSuccesses: number;
  downed: number;
}

export interface RoundData {
  round: number;
  initiative: InitiativeCount[];
  enemiesRemain: number;
  pcsRemain: number;
  enemyPoolRemains: number;
}

export interface InitiativeCount {
  initiativeCount: number;
  turns: (PCTurnData | EnemyTurnData)[];
  enemiesRemain: number;
  pcsRemain: number;
}

// everything is for a number of rounds until cancelled - (+duration)
export const PC_STATUS = {
  ADV_ACT: "ADV_ACT",
  DADV_ACT: "DADV_ACT",
  ADV_DEFEND: "ADV_DEFEND",
  DADV_DEFEND: "DADV_DEFEND",
  TRAINED_ACT: "TRAINED_ACT",
  TRAINED_DEFEND: "TRAINED_DEFEND",
  TRAINED_HEAL: "TRAINED_HEAL",
  PC_LING_DMG: "PC_LING_DMG",
};

export const ENEMY_STATUS = {
  ADV_DEFEND_AGAINST: "ADV_DEFEND_AGAINST",
  DADV_DEFEND_AGAINST: "DADV_DEFEND_AGAINST",
  ADV_ACT_AGAINST: "ADV_ACT_AGAINST",
  DADV_ACT_AGAINST: "DADV_ACT_AGAINST",
  ENEMY_LING_DMG: "ENEMY_LING_DMG",
};

export const isEnemyStatus = (status: string): status is keyof typeof ENEMY_STATUS => {
  return status in ENEMY_STATUS;
}

export const isBeneficialStatus = (status: string): boolean => {
  return status.startsWith("ADV_") || status.startsWith("TRAINED_") || status === ENEMY_STATUS.ENEMY_LING_DMG;
}

export interface Condition {
  name: string;
  // TODO make enum
  status: string;
  // lasts a number of rounds
  duration: number;
  // does it end at the top or the bottom of the turn
  ends: "top" | "bottom";
  // damage
  lingeringDamage?: number;
}

export interface Enemy {
  type: "enemy";
  tier: number;
  pool: number;
  number: number;
  conditions: Condition[];
  wellspring: number;
  rewards: RewardOptions[];
}

export interface GM {
  enemies: Enemy[];
  initiative: Enemy[][];
}

export interface PC {
  type: "pc";
  name: string;
  level: number;
  pool: number;
  startingPool: number;
  initiative: number;
  number: number;
  startingWellspring: number;
  wellspring: number;
  fortune: number;
  fleeing?: boolean;
  fledRounds: number;
  conditions: Condition[];
  rewards: RewardOptions[];
  deathFails: number;
  dead: boolean;
  // for calculating number of features
  eduMod?: number;
}
export interface Creatures {
  GM: GM;
  pcs: PC[];
}

export interface EnemyAttackData {
  pc: PC;
  roll: PCRoll;
  needed: number;
  usedFortune: number;
  damage: number;
  fullDodge: boolean;
  partialDodge: boolean;
  crit: boolean;
  downed: boolean;
  pcPool: number;
  message?: string;
}

export interface EnemyTurnData {
  type: "enemy_turn";
  enemy: Enemy;
  snapshot: Enemy;
  // TODO: Fleeing
  action: "SKIP" | "ATTACK" | "FLEE";
  // TODO: can be more than one pc on an AoE attack
  attacked: EnemyAttackData[];
  message?: string;
  usedReward?: Reward;
}

export interface PCAttackData {
  enemy: Enemy;
  damage: number;
  pool: number;
  message: string;
}

export interface PCAction {
  type: "ATTACK" | "HEAL" | "SKIP" | "FLEE" | "HELP" | "DEATH_SAVE" | "OTHER";
  roll?: PCRoll;
  needed?: number;
  usedFortune?: number;
  usedWellspring?: number;
  hitTimes?: number;
  dealt?: number;
  againstEnemies?: PCAttackData[];
  withPCs?: PC[];
  killed?: Enemy[];
  // grant advantage to this pc's next defense or to the next defense roll against this enemy
  advantageDefense?: PC | Enemy;
  // grant advantage to this pc's next action or to the next action against this enemy
  advantageAction?: PC | Enemy;
  message?: string;
  usedReward?: Reward;
}

export interface PCTurnData {
  type: "pc_turn";
  pc: PC;
  snapshot: PC;
  action?: PCAction;
  interaction?: PCAction;
  deathSave?: number;
}

export interface PCRollOptions {
  advToHit: boolean;
  advToDefend: boolean;
  trainedToHit: boolean;
  trainedToDefend: boolean;
  advToHeal: boolean;
  trainedToHeal: boolean;
  pcsWillFlee: boolean;
  doInteraction: boolean;
}
