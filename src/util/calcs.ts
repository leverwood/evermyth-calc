import { ABILITY_MIN_LVL } from "./constants";

export const getTier = (lvl: number): number => {
  return Math.ceil(lvl / 4);
};

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

export const getRewardMinDealt = (tier: number) => {
  return tier + 2;
};

/**
 * (-2) backfire
 * (-tier) wellspring cost
 * (+2) +2 dmg
 * (+tier) +tier dmg
 * (+tier) +tier dmg
 * Total = tier
 * ---
 * 2 base damage + 2 + tier +tier
 */
export const getRewardMaxDealt = (tier: number) => {
  return 2 + 2 + tier + tier;
};

export const getDCMedium = (tier: number) => {
  return tier * 3 + 7;
};

export const getDCEasy = (tier: number) => {
  return getDCMedium(tier) - 3;
};

export const getDCHard = (tier: number) => {
  return getDCMedium(tier) + 3;
};

/**
 * What you must roll on a dice to beat a DC
 * @param mod
 * @param dc
 */
export const beatDCOn = (mod: number, dc: number) => {
  // max roll is a 20
  const beatIt = Math.min(dc - mod, 20);
  // always fail on a 1
  return Math.max(beatIt, 2);
};

export const chanceToFail = (mod: number, dc: number) => {
  return (beatDCOn(mod, dc) - 1) / 20;
};

export const chanceToSucceed = (mod: number, dc: number) => {
  return 1 - chanceToFail(mod, dc);
};

export const totalWellspring = (lvl: number) => {
  return 3 + getTier(lvl) + lvl;
};

export const maxWellspringCast = (lvl: number) => {
  return getTier(lvl);
};

export const findDieSize = (dealt: number): number | undefined => {
  const die = [4, 6, 8, 10, 12];
  const dieSize = die.find((d) => (dealt * 2) % d === 0 && (dealt * 2) / d < d);
  return dieSize;
};

export const dealtToDice = (dealt: number): string | number => {
  if (dealt < 2) {
    return dealt;
  }
  const dieSize = findDieSize(dealt);
  if (dieSize) {
    return `${(dealt * 2) / dieSize}d${dieSize} (${dealt})`;
  }

  // subtract 2 and try again
  let currentDealt = dealt;
  let flatExtra = 0;
  while (currentDealt > 0 && !findDieSize(currentDealt)) {
    flatExtra++;
    currentDealt--;
  }
  const newDieSize = findDieSize(currentDealt) as number;
  return `${
    (currentDealt * 2) / newDieSize
  }d${newDieSize} + ${flatExtra}  (${dealt})`;
};
