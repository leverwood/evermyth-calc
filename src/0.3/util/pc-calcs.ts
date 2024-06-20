import { Condition, ENEMY_STATUS, PC, PC_STATUS } from "../types/system-types";
import { SavedPCData } from "../../players/types/pc-types";
import { getTier } from "../../util/calcs";
import { FLED_AFTER_ROUNDS } from "../../util/constants";
import { getRandomNum } from "../../util/math";

export const initPC = (level: number, name: string): PC => {
  const wellspring = getPCWellspring(level);
  const startingPool = 0;
  return {
    type: "pc",
    name,
    level: level,
    initiative: 0,
    pool: startingPool,
    startingPool: startingPool,
    number: 0,
    startingWellspring: wellspring,
    wellspring: wellspring,
    fortune: 0,
    fledRounds: 0,
    conditions: [],
    rewards: [],
    deathFails: 0,
    dead: false,
  };
};

export const getMaxMod = (level: number) => {
  return getTier(level);
};

// random pool number
export const getPCRandomPool = (level: number) => {
  const mod = getRandomNum(0, getMaxMod(level));
  return getPCPool(level, mod);
};

export const getPCMaxPool = (level: number) =>
  getPCPool(level, getMaxMod(level));

export const getPCPool = (level: number, mod: number) =>
  mod + mod + getTier(level) + 3;

// adding tier significantly decreases downed chance
export const getPCWellspring = (level: number) => {
  return 3 + level;
};

export const getPCLearnedFeatures = (pc: SavedPCData) => {
  return 6 + (pc.eduMod || 0) * 4;
};

export const getTotalPCTiers = (pcs: PC[]) => {
  return pcs.reduce((acc, pc) => acc + getTier(pc.level), 0);
};

// cannot target pcs that have fled
export const getTargetablePCs = (pcs: PC[]) =>
  pcs.filter(
    (p) => p.pool > 0 && (!p.fledRounds || p.fledRounds < FLED_AFTER_ROUNDS)
  );

export const getUpPCs = (pcs: PC[]) => pcs.filter((p) => p.pool > 0);

export const hasAdv = (
  type: "action" | "defense",
  pcCond: Condition[],
  enemyCond: Condition[]
): {
  rollWith: "ADV" | "DADV" | "NORMAL";
  conditions: Condition[];
} => {
  // things that grant advantage
  const pcAdvs = pcCond.filter(
    (c) =>
      c.status ===
      (type === "action" ? PC_STATUS.ADV_ACT : PC_STATUS.ADV_DEFEND)
  );

  const enemyDisadvs = enemyCond.filter(
    (c) =>
      c.status ===
      (type === "action"
        ? ENEMY_STATUS.ADV_ACT_AGAINST
        : ENEMY_STATUS.ADV_DEFEND_AGAINST)
  );
  // things that grants disadvantage
  const pcDisadvs = pcCond.filter(
    (c) =>
      c.status ===
      (type === "action" ? PC_STATUS.DADV_ACT : PC_STATUS.DADV_DEFEND)
  );
  const enemyAdvs = enemyCond.filter(
    (c) =>
      c.status ===
      (type === "action"
        ? ENEMY_STATUS.DADV_ACT_AGAINST
        : ENEMY_STATUS.DADV_DEFEND_AGAINST)
  );

  const totalAdv =
    pcAdvs.length + enemyDisadvs.length - pcDisadvs.length - enemyAdvs.length;

  return {
    rollWith: totalAdv > 0 ? "ADV" : totalAdv < 0 ? "DADV" : "NORMAL",
    conditions: [...pcAdvs, ...enemyDisadvs, ...pcDisadvs, ...enemyAdvs],
  };
};

export const names: string[] = [
  "Olivia",
  "Liam",
  "Sophia",
  "Ethan",
  "Isabella",
  "Mason",
  "Emma",
  "Lucas",
  "Ava",
  "Amelia",
  "Noah",
  "Charlotte",
  "James",
  "Harper",
  "Benjamin",
  "Lily",
  "Jack",
  "Ella",
  "Theodore",
  "Aurora",
];

