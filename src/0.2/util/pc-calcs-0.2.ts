import { getTier } from "../../util/calcs";
import { ABILITY_MIN_LVL } from "../../util/constants";

export const getTotalAbilityPoints = (lvl: number) => {
  return lvl + 3 + getTier(lvl);
};
export const getPowerLevel = (lvl: number) => {
  return getTier(lvl) * 3 + 2;
};

export const getMaxAbility = (lvl: number) => {
  return getTier(lvl) + 2;
};

export const getPool = (ability: number, lvl: number) => {
  return 6 + ability + lvl;
};

export const getMaxPool = (lvl: number) => {
  return getPool(getMaxAbility(lvl), lvl);
};

export const getMinPool = (lvl: number) => {
  return getPool(ABILITY_MIN_LVL, lvl);
};
