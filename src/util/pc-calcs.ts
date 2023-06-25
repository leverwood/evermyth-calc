import { getTier } from "./calcs";
import { ABILITY_MIN_LVL } from "./constants";

export const getTotalAbilityPoints = (lvl: number) => {
  return lvl + 3 + getTier(lvl);
};
export const getPowerLevel = (lvl: number) => {
  return getTier(lvl) * 3 + 2;
};

export const getMaxAbilty = (lvl: number) => {
  return getTier(lvl) + 2;
};

export const getPool = (ablity: number, lvl: number) => {
  return 6 + ablity + lvl;
};

export const getMaxPool = (lvl: number) => {
  return getPool(getMaxAbilty(lvl), lvl);
};

export const getMinPool = (lvl: number) => {
  return getPool(ABILITY_MIN_LVL, lvl);
};
