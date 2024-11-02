import { Enemy } from "../types/system-types";

export function getDCMedium(tier: number) {
  return 10 + Math.ceil(tier);
}

export function getDCHard(tier: number) {
  return getDCMedium(tier) + 4;
}

export function getDCEasy(tier: number) {
  return getDCMedium(tier) - 4;
}

export function getDCToHitEnemy(enemyTier: number) {
  return getDCMedium(enemyTier);
}

export function getDCToDefend(enemyTier: number) {
  return getDCMedium(enemyTier);
}

export const getEnemyWellspring = (enemyTier: number) => enemyTier * 2;

export const getTotalEnemyTiers = (enemies: Enemy[]) =>
  enemies.reduce((acc, enemy) => acc + enemy.tier, 0);

// 4 * tier is a remarkably stable number
export const getEnemyPool = (tier: number) => {
  return tier === 0 ? 1 : 4 * tier;
};

export const getPartialDamage = (fullDamage: number) =>
  fullDamage > 0 ? Math.floor(fullDamage / 2) : 0;
