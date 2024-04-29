import { Enemy } from "../types/system-types";

export function getDCMedium(tier: number) {
  return 9 + tier;
}

export function getDCHard(tier: number) {
  return getDCMedium(tier) + 3;
}

export function getDCEasy(tier: number) {
  return getDCMedium(tier) - 3;
}

export function getDCToHitEnemy(enemyTier: number) {
  return enemyTier === 0 ? 10 : getDCHard(enemyTier);
}

export function getDCToDefend(enemyTier: number) {
  return enemyTier === 0 ? 10 : getDCHard(enemyTier) + 3;
}

export const getEnemyWellspring = (enemyTier: number) => enemyTier;

export const getTotalEnemyTiers = (enemies: Enemy[]) =>
  enemies.reduce((acc, enemy) => acc + enemy.tier, 0);

// 4 * tier is a remarkably stable number
export const getEnemyPool = (tier: number) => {
  return tier === 0 ? 1 : 4 * tier;
};

export const getPartialDamage = (fullDamage: number) =>
  fullDamage > 0 ? Math.floor(fullDamage / 2) : 0;
