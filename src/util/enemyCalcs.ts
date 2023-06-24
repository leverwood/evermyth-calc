import {
  chanceToFail,
  chanceToSucceed,
  getDCMedium,
  getMaxPool,
  getPowerLevel,
  getRewardMinDealt,
  getTier,
} from "./calcs";
import { TIER_0_ENEMY_POOL } from "./constants";

export const getEncounterTiers = (lvl: number, players: number) => {
  return Math.ceil((lvl * players) / 6);
};

export const getEnemies = (lvl: number, players: number) => {
  let totalTiers = getEncounterTiers(lvl, players);
  const maxTier = getTier(lvl);
  let current = maxTier;
  const enemies = [];
  while (totalTiers > 0 && current > 0) {
    if (current <= totalTiers) {
      enemies.push(current);
      totalTiers -= current;
    } else current--;
  }
  if (maxTier === 1) return [...enemies, ...new Array(players).fill(0)];
  else return enemies;
};

export const maxEnemyPools = (lvl: number, players: number) => {
  const enemies = getEnemies(lvl, players);
  return enemies.reduce((acc, cur) => acc + getEnemyPool(cur), 0);
};

export const getAgainstDC = (tier: number) => {
  return getDCMedium(tier);
};

export const getDefenseDC = (tier: number) => {
  return getDCMedium(tier) + 4;
};

export const getEnemyPool = (tier: number) => {
  if (tier === 0) return TIER_0_ENEMY_POOL;
  return tier * 10;
};

export const chanceToHitEnemy = (enemyTier: number, mod: number) => {
  const againstDC = getAgainstDC(enemyTier);
  return chanceToSucceed(mod, againstDC);
};

export const chanceToGetHit = (enemyTier: number, mod: number) => {
  const defenseDC = getDefenseDC(enemyTier);
  return chanceToFail(mod, defenseDC);
};

export const averageMinEnemyDealt = (enemyTier: number, pcLvl: number) => {
  const chanceHit = chanceToGetHit(enemyTier, getPowerLevel(pcLvl));
  return chanceHit * getRewardMinDealt(enemyTier);
};

export const minRoundsToWin = (lvl: number, players: number) => {
  const totalPool = maxEnemyPools(lvl, players);
};

// TODO: Use middling player pool
// TODO: Accomodate wellspring for enemies
export const maxRoundsToLose = (lvl: number, players: number) => {
  const totalPCPool = getMaxPool(lvl) * players;
  let remainingPool = totalPCPool;
  const enemies = getEnemies(lvl, players);
  let round = 1;
  while (remainingPool > 0) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      remainingPool -= averageMinEnemyDealt(enemy, lvl);
    }
    round++;
  }
  return round;
};
