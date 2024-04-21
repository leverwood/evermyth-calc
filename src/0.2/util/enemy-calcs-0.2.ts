import { chanceToFail, chanceToSucceed, getDCHardOld, getTier } from "../../util/calcs";
import { TIER_0_ENEMY_POOL } from "../../util/constants";
import { getPowerLevel, getMaxPool } from "./pc-calcs-0.2";
import {
  getEnemyRewardMaxDealt,
  getPCRewardMaxDealt,
  getRewardMinDealt,
} from "./reward-calcs-0.2";

export const getEncounterTiersOld = (lvl: number, pcs: number) => {
  const totalPCLevels = lvl * pcs;
  return 1 + Math.floor(totalPCLevels / 5);
};

export const getEnemies = (lvl: number, pcs: number) => {
  let totalTiers = getEncounterTiersOld(lvl, pcs);
  const maxTier = getTier(lvl);
  let current = maxTier;
  const enemies = [];
  while (totalTiers > 0 && current > 0) {
    if (current <= totalTiers) {
      enemies.push(current);
      totalTiers -= current;
    } else current--;
  }
  return [...enemies, ...new Array(pcs).fill(0)];
};

// sum of all enemy pools
export const totalEnemyPools = (lvl: number, pcs: number) => {
  const enemies = getEnemies(lvl, pcs);
  return enemies.reduce((acc, cur) => acc + getEnemyPoolOld(cur), 0);
};

export const getAgainstDC = (tier: number) => {
  if (tier === 0) return 7;
  return getDCHardOld(tier);
};

export const getDefenseDC = (tier: number) => {
  if (tier === 0) return 11;
  return getAgainstDC(tier) + 3;
};

export const getEnemyPoolOld = (tier: number) => {
  if (tier === 0) return TIER_0_ENEMY_POOL;
  return 10 + tier * 10;
};

export const chanceToHitEnemyOld = (enemyTier: number, mod: number) => {
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
export const maxRoundsToWin = (lvl: number, pcs: number) => {
  const totalPool = totalEnemyPools(lvl, pcs);
  const eachRoundDeal =
    getRewardMinDealt(getTier(lvl)) *
    chanceToHitEnemyOld(getTier(lvl), getPowerLevel(lvl)) *
    pcs;
  return Math.ceil(totalPool / eachRoundDeal);
};

/**
 * Assumptions:
 * - PCs dump all wellspring round 1
 * - PCs always have advantage
 */
export const minRoundsToWin = (lvl: number, pcs: number) => {
  const tier = getTier(lvl);
  let remainingPool = totalEnemyPools(lvl, pcs);

  // how many times can you cast your most powerful thing
  // assume uses all wellspring on first round
  const maxCastTimes = 1;
  const roundMaxDeal =
    getPCRewardMaxDealt(lvl) *
    chanceToHitEnemyOld(tier, getPowerLevel(lvl)) *
    pcs;
  let round;
  for (round = 1; round <= maxCastTimes; round++) {
    remainingPool -= roundMaxDeal;
    if (remainingPool <= 0) return round;
  }
  const followingRoundsDeal =
    getRewardMinDealt(getTier(lvl)) *
    chanceToHitEnemyOld(getTier(lvl), getPowerLevel(lvl)) *
    pcs;

  return round + Math.ceil(remainingPool / followingRoundsDeal);
};

/**
 * Assumptions
 * - Against pc's max pool
 * - Enemies have wellspring and dump all of it round 1
 */
export const roundsToLose = (lvl: number, pcs: number) => {
  const totalPCPool = getMaxPool(lvl) * pcs;
  let remainingPool = totalPCPool;
  const enemies = getEnemies(lvl, pcs);
  // console.log(
  //   `------- FIGHT ------------ ${pcs} Lvl ${lvl} vs ${enemies.join(
  //     ", "
  //   )}. Total PC Pool: ${totalPCPool}`
  // );
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
      // console.log(
      //   `Round ${round} T${enemy} deals ${deals} damage. ${remainingPool} remaining`
      // );
      if (remainingPool <= 0) return round;
    }
    round++;
  }
  return round;
};

export const totalEnemyWellspring = (tier: number) => tier * 4;
