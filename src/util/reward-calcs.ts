import { getTier, totalPCWellspring } from "./calcs";
import { RewardAttribute } from "./constants";
import {
  flatToRolled,
  flatToRolledPrint,
  printAllFormulaData,
} from "./dice-calcs";
import { totalEnemyWellspring } from "./enemy-calcs";

export const rewardTier = (attributes: RewardAttribute[]): number => {
  return attributes.reduce((sum, attribute) => sum + attribute.tier, 0);
};

const printAoE = (attributes: RewardAttribute[]) => {
  return attributes.some((a) => a.aoe) ? " AOE" : "";
};

export const rewardDealt = (attributes: RewardAttribute[]): string => {
  return printValueTiered("deals", attributes, true) + printAoE(attributes);
};

const printDealt = (attributes: RewardAttribute[]) => {
  const dealt = rewardDealt(attributes);
  return dealt ? `deals ${dealt}` : "";
};

export const rewardBackfire = (attributes: RewardAttribute[]): number => {
  return attributes.reduce((sum, attribute) => sum + attribute.backfire, 0);
};
export const printBackfire = (attributes: RewardAttribute[]) => {
  const backfire = rewardBackfire(attributes);
  return backfire > 0
    ? `on fail deals ${printAllFormulaData(
        flatToRolled(backfire)
      )} to your [POOL]`
    : "";
};

export const rewardMod = (attributes: RewardAttribute[]): string => {
  return printValueTiered("mod", attributes);
};
function printMod(attributes: RewardAttribute[]) {
  const mod = rewardMod(attributes);
  return mod ? `${mod}` : "";
}

export const rewardWellspring = (attributes: RewardAttribute[]): boolean => {
  return attributes.some((a) => a.wellspring);
};
const printWellspring = (attributes: RewardAttribute[]) => {
  return rewardWellspring(attributes) ? "wellspring" : "";
};

const printConsumable = (attributes: RewardAttribute[]) => {
  const isConsumable = attributes.some((a) => a.consumable);
  return isConsumable ? "consumable" : "";
};

const printRollType = (attributes: RewardAttribute[]) => {
  const rollType = attributes.find((a) => a.rollType)?.rollType;
  if (rollType) return rollType;

  const nocheck = attributes.some((a) => !a.checkRequired);
  if (nocheck) return "safe action";

  const noAction = attributes.some((a) => a.noAction);
  if (noAction) return "no action";

  return "";
};

export const rewardRestores = (attributes: RewardAttribute[]): string => {
  return printValueTiered("restores", attributes, true);
};
const printRestores = (attributes: RewardAttribute[]) => {
  const restores = rewardRestores(attributes);
  return restores ? `restores ${restores}` : "";
};

const printValueTiered = (
  attributeName: keyof RewardAttribute,
  attributes: RewardAttribute[],
  isDealt = false
) => {
  const totalTier = attributes.filter(
    (a) => a[attributeName] === "tier"
  ).length;

  // total flat value
  let total = attributes.reduce((sum, attribute) => {
    const value = attribute[attributeName];
    if (typeof value === "number") {
      return sum + value;
    }
    return sum;
  }, 0);

  // handle multipliers
  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    const multiplier =
      attribute[(attributeName + "Multiplier") as keyof RewardAttribute];
    if (multiplier) {
      total *= multiplier as number;
    }
  }
  // round down
  total = Math.floor(total);

  if (total === 0 && totalTier === 0) return "";

  const printMod = isDealt
    ? flatToRolledPrint(total)
    : `${total >= 0 ? "+" : ""}${total}`;
  const printTierMultiple = totalTier > 1 ? ` x ${totalTier}` : "";

  return `${total ? printMod : ""}${total && totalTier ? "+" : ""}${
    totalTier ? `TIER${printTierMultiple}` : ""
  }`;
};

export const rewardDefense = (attributes: RewardAttribute[]): string => {
  return printValueTiered("defense", attributes);
};
const printDefense = (attributes: RewardAttribute[]) => {
  const defense = rewardDefense(attributes);
  return defense ? `+${defense} defense` : "";
};

export const doesRewardScale = (attributes: RewardAttribute[]): boolean => {
  return attributes.some((a) => a.scales);
};

// TODO: Scales

export const printReward = (attributes: RewardAttribute[]) => {
  const parts = [
    printMod(attributes),
    printDefense(attributes),
    printRollType(attributes),
    printDealt(attributes),
    printBackfire(attributes),
    printRestores(attributes),
    printWellspring(attributes),
    printConsumable(attributes),
  ];

  return `${parts.filter((p) => p).join(", ")}`;
};

export const getRewardMinDealt = (tier: number) => {
  return tier + 2;
};

/**
 * Blow literally all your wellspring on the most powerful thing
 * (+0) deal 2
 * (+0) upcast deal
 * (-1) wellspring
 * (-tier) backfire tier
 * (+tier) deal tier
 * (+tier) deal tier
 * (+1) deal 1
 * --- total = tier
 */
export const getPCRewardMaxDealt = (lvl: number) => {
  const tier = getTier(lvl);
  // spend all remaining wellspring increasing the dealt
  const extraWellspringSpent = totalPCWellspring(lvl) - tier;

  return 2 + extraWellspringSpent + tier + tier + 1;
};

/**
 * Blow literally all your wellspring on the most powerful thing
 * (+0) deal 2
 * (+0) upcast deal
 * (-1) wellspring
 * (+tier) deal tier
 * (+tier) deal tier
 * (+1) deal 1
 * --- total = tier
 */
export const getEnemyRewardMaxDealt = (tier: number) => {
  // spend all remaining wellspring increasing the dealt
  const extraWellspringSpent = totalEnemyWellspring(tier) - tier;

  return 2 + extraWellspringSpent + tier + tier + 1;
};
