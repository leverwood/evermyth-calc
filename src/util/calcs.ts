export const getTier = (lvl: number): number => {
  return Math.ceil(lvl / 4);
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

export const chanceToFail = (
  mod: number,
  dc: number,
  rollType?: "advantage" | "disadvantage"
) => {
  return 1 - chanceToSucceed(mod, dc, rollType);
};

export function chanceToSucceed(
  modifier: number,
  dc: number,
  rollType?: "advantage" | "disadvantage"
) {
  const successRoll = beatDCOn(modifier, dc);

  // no advantage or disadvantage
  if (!rollType) {
    // Count the successful outcomes
    let successCount = 20 - successRoll + 1;
    return successCount / 20;
  }

  // Count the successful outcomes
  let successCount = 0;
  let totalOutcomes = 0;

  for (let roll1 = 1; roll1 <= 20; roll1++) {
    for (let roll2 = 1; roll2 <= 20; roll2++) {
      totalOutcomes++;
      let result =
        rollType === "advantage"
          ? Math.max(roll1, roll2)
          : Math.min(roll1, roll2);
      if (result >= successRoll) {
        successCount++;
      }
    }
  }

  return successCount / totalOutcomes;
}

export const totalPCWellspring = (lvl: number) => {
  return 3 + getTier(lvl) + lvl;
};

export const maxWellspringCast = (lvl: number) => {
  return getTier(lvl);
};
