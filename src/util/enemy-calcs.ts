import { chanceToFail, chanceToSucceed, getDCHard, getTier } from "./calcs";
import { TIER_0_ENEMY_POOL } from "./constants";
import { getPowerLevel, getMaxPool } from "./pc-calcs";
import {
  getEnemyRewardMaxDealt,
  getPCRewardMaxDealt,
  getRewardMinDealt,
} from "./reward-calcs";

export const getEncounterTiers = (lvl: number, players: number) => {
  const totalPlayerLevels = lvl * players;
  return 1 + Math.floor(totalPlayerLevels / 4);
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
  return [...enemies, ...new Array(players).fill(0)];
};

export const maxEnemyPools = (lvl: number, players: number) => {
  const enemies = getEnemies(lvl, players);
  return enemies.reduce((acc, cur) => acc + getEnemyPool(cur), 0);
};

export const getAgainstDC = (tier: number) => {
  return getDCHard(tier);
};

export const getDefenseDC = (tier: number) => {
  return getAgainstDC(tier) + 3;
};

export const getEnemyPool = (tier: number) => {
  if (tier === 0) return TIER_0_ENEMY_POOL;
  return 10 + tier * 5;
};

export const chanceToHitEnemy = (enemyTier: number, mod: number) => {
  const againstDC = getAgainstDC(enemyTier);
  return chanceToSucceed(mod, againstDC, "advantage");
};

export const chanceToGetHit = (enemyTier: number, mod: number) => {
  const defenseDC = getDefenseDC(enemyTier);
  return chanceToFail(mod, defenseDC);
};

export const averageMinEnemyDealt = (enemyTier: number, pcLvl: number) => {
  const chanceHit = chanceToGetHit(enemyTier, getPowerLevel(pcLvl));
  const dealt = enemyTier === 0 ? 1 : getRewardMinDealt(enemyTier);
  return chanceHit * dealt;
};
export const averageMaxEnemyDealt = (enemyTier: number, pcLvl: number) => {
  const chanceHit = chanceToGetHit(enemyTier, getPowerLevel(pcLvl));
  const dealt = enemyTier === 0 ? 1 : getEnemyRewardMaxDealt(enemyTier);
  return chanceHit * dealt;
};

/** always using the lowest attack for their tier. Use chance to hit enemy */
export const maxRoundsToWin = (lvl: number, players: number) => {
  const totalPool = maxEnemyPools(lvl, players);
  const eachRoundDeal =
    getRewardMinDealt(getTier(lvl)) *
    chanceToHitEnemy(getTier(lvl), getPowerLevel(lvl)) *
    players;
  return Math.ceil(totalPool / eachRoundDeal);
};

// export const minRoundsToWin2 = (lvl: number, players: number) => {
//   const totalPool = maxEnemyPools(lvl, players);
//   const eachRoundDeal =
//     getEnemyRewardMaxDealt(getTier(lvl)) *
//     chanceToHitEnemy(getTier(lvl), getPowerLevel(lvl)) *
//     players;
//   return Math.ceil(totalPool / eachRoundDeal);
// };

export const minRoundsToWin = (lvl: number, players: number) => {
  const tier = getTier(lvl);
  let remainingPool = maxEnemyPools(lvl, players);

  // how many times can you cast your most powerful thing
  // assume uses all wellspring on first round
  const maxCastTimes = 1;
  const roundMaxDeal =
    getPCRewardMaxDealt(lvl) *
    chanceToHitEnemy(tier, getPowerLevel(lvl)) *
    players;
  let round;
  for (round = 1; round <= maxCastTimes; round++) {
    remainingPool -= roundMaxDeal;
    if (remainingPool <= 0) return round;
  }
  const followingRoundsDeal =
    getRewardMinDealt(getTier(lvl)) *
    chanceToHitEnemy(getTier(lvl), getPowerLevel(lvl)) *
    players;

  return round + Math.ceil(remainingPool / followingRoundsDeal);
};

// TODO: Use middling player pool
// TODO: Accomodate wellspring for enemies
export const roundsToLose = (lvl: number, players: number) => {
  const totalPCPool = getMaxPool(lvl) * players;
  let remainingPool = totalPCPool;
  const enemies = getEnemies(lvl, players);
  console.log(
    `------- FIGHT ------------ ${players} Lvl ${lvl} vs ${enemies.join(
      ", "
    )}. Total PC Pool: ${totalPCPool}`
  );
  let round = 1;
  while (remainingPool > 0) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      // includes chance to get hit
      const deals =
        round === 1
          ? averageMaxEnemyDealt(enemy, lvl)
          : averageMinEnemyDealt(enemy, lvl);
      remainingPool -= deals;
      console.log(
        `Round ${round} T${enemy} deals ${deals} damage. ${remainingPool} remaining`
      );
      if (remainingPool <= 0) return round;
    }
    round++;
  }
  return round;
};

export const totalEnemyWellspring = (tier: number) => tier * 4;
