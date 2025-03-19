import {
  REWARD_TYPE,
  RewardData,
  Reward,
  OPTION_COST,
  isReward,
  RewardDataID,
  STAGE,
  STAGE_COST,
  DMG_TYPE,
} from "../types/reward-types";
import {
  Condition,
  ENEMY_STATUS,
  Enemy,
  PC_STATUS,
  PC,
  isBeneficialStatus,
  isEnemyStatus,
} from "../../0.3/types/system-types";
import { getDCHard } from "../../0.3/util/enemy-calc";
import { LOG_LEVEL, Logger } from "../../util/log";
import { hasAdv } from "../../0.3/util/pc-calcs";
import { REWARD_STAGE_LIMITS } from "./reward-stage-limits";

const logger = Logger(LOG_LEVEL.ERROR);

export function initReward({
  name = "",
  stage = STAGE.CHECK,
  advantage = false,
  advantageMsg = "",
  aoe = false,
  avoidAllies = false,
  castTime = 0,
  castTimeMsg = "",
  conditions = [],
  consumable = false,
  cost = 0,
  curse = 0,
  curseMsg = "",
  deals = 0,
  disadvantage = false,
  disadvantageMsg = "",
  duration = 0,
  durationMsg = "",
  flavor = "",
  grantsAbilities = [],
  heals = 0,
  instructions,
  immune = [],
  imposeVulnerable = [],
  lingeringDamage = 0,
  meleeAndRanged = false,
  multiRewards = [],
  noChase = false,
  notes = "",
  onFailTakeDamage = 0,
  onFailDmgType = DMG_TYPE.USED,
  onAutoSuccess = false,
  onSuccess = false,
  overrideTier = undefined,
  prefix = undefined,
  price = 0,
  ranged = false,
  rangeIncrease = 0,
  reduceDamage = 0,
  relentless = false,
  relentlessMsg = "",
  resistant = [],
  restrained = 0,
  requiresAmmo = false,
  specific = false,
  specificMsg = "",
  speed = 0,
  speedType = "",
  stunned = 0,
  suffix = undefined,
  summon = false,
  summonTierIncrease = 0,
  summonName = "creature",
  teleport = false,
  tierDecrease = 0,
  tierIncrease = 0,
  trained = false,
  trainedMsg = "",
  type = REWARD_TYPE.EQUIPMENT,
  upcast,
  upcastMax = 0,
  vulnerable = [],
  wellspringMax = 0,
  wellspringRecover = 0,
}: RewardData): Reward {
  const reward: Reward = {
    __typename: "Reward",
    name,
    stage,
    deals: 0,
    heals: 0,
    cost: 0,
    tier: -1,
    type,
    price,
    meleeAndRanged,
    prefix,
    suffix,
    flavor,
  };
  reward.tier += STAGE_COST[stage];

  if (advantage) {
    reward.tier += OPTION_COST.advantage;
    reward.advantage = true;
    reward.advantageMsg = advantageMsg;
  }
  if (aoe) {
    reward.tier += OPTION_COST.aoe;
    reward.aoe = true;
    reward.rangeIncrease = rangeIncrease;
  }
  if (avoidAllies) {
    reward.tier += OPTION_COST.avoidAllies;
    reward.avoidAllies = true;
  }
  if (castTime) {
    reward.tier += castTime * OPTION_COST.castTime;
    reward.castTime = castTime;
    reward.castTimeMsg = castTimeMsg;
  }
  if (conditions.length) {
    reward.conditions = conditions;
    for (const c of conditions) {
      // lingering damage (the damage, and it taking away the action)
      if (c.lingeringDamage) {
        reward.tier += isBeneficialStatus(c.status)
          ? c.lingeringDamage + 1
          : -c.lingeringDamage - 1;
      } else {
        // enemy conditions are +2 tiers / duration
        if (isEnemyStatus(c.status)) {
          reward.tier += isBeneficialStatus(c.status)
            ? 2 * c.duration
            : -2 * c.duration;
        } else
          reward.tier += isBeneficialStatus(c.status) ? c.duration : c.duration;
      }
    }
  }
  if (consumable) {
    reward.tier += OPTION_COST.consumable;
    reward.consumable = true;
  }
  if (cost) {
    reward.tier += cost * OPTION_COST.cost;
    reward.cost += cost;
  }
  if (curse) {
    reward.tier -= curse;
    reward.curse = curse;
    reward.curseMsg = curseMsg;
  }
  if (deals) {
    reward.tier += deals * OPTION_COST.deals;
    reward.deals += deals;
  }
  if (disadvantage) {
    reward.tier += OPTION_COST.disadvantage;
    reward.disadvantage = true;
    reward.disadvantageMsg = disadvantageMsg;
  }
  // lasts longer, good thing
  if (duration) {
    reward.tier += duration * OPTION_COST.duration;
    reward.duration = duration;
    reward.durationMsg = durationMsg;
  }
  if (grantsAbilities.length) {
    reward.tier += grantsAbilities.length * OPTION_COST.grantsAbilities;
    reward.grantsAbilities = grantsAbilities;
  }
  if (heals) {
    reward.tier += heals * OPTION_COST.heals;
    reward.heals += heals;
  }
  if (immune.length) {
    reward.tier += immune.length * OPTION_COST.immune;
    reward.immune = immune;
  }
  if (imposeVulnerable.length) {
    reward.tier += imposeVulnerable.length * OPTION_COST.imposeVulnerable;
    reward.imposeVulnerable = imposeVulnerable;
  }
  if (instructions) {
    reward.instructions = instructions;
  }
  if (lingeringDamage) {
    reward.lingeringDamage = lingeringDamage;
    reward.tier += OPTION_COST.lingeringDamage * lingeringDamage;
  }
  if (noChase) {
    reward.tier += OPTION_COST.noChase;
    reward.noChase = true;
  }
  if (notes) {
    reward.notes = notes;
  }
  if (onFailTakeDamage) {
    reward.tier += onFailTakeDamage * OPTION_COST.onFailTakeDamage;
    reward.onFailTakeDamage = onFailTakeDamage;
    reward.onFailDmgType = onFailDmgType;
  }
  if (onAutoSuccess) {
    reward.onAutoSuccess = true;
    reward.tier += OPTION_COST.onAutoSuccess;
  }
  if (onSuccess) {
    reward.onSuccess = true;
    reward.tier += OPTION_COST.onSuccess;
  }
  if (ranged) {
    reward.ranged = true;
    reward.rangeIncrease = rangeIncrease;
    reward.tier += OPTION_COST.rangeIncrease * rangeIncrease;
  }
  if (reduceDamage) {
    reward.tier += reduceDamage * OPTION_COST.reduceDamage;
    reward.reduceDamage = reduceDamage;
  }
  if (relentless) {
    reward.tier += OPTION_COST.relentless;
    reward.relentless = true;
    reward.relentlessMsg = relentlessMsg;
  }
  if (resistant.length) {
    reward.tier += resistant.length * OPTION_COST.resistant;
    reward.resistant = resistant;
  }
  if (restrained) {
    reward.tier += OPTION_COST.restrained * restrained;
    reward.restrained = restrained;
  }
  if (requiresAmmo) {
    reward.tier += OPTION_COST.requiresAmmo;
    reward.requiresAmmo = true;
  }
  if (specific) {
    reward.tier += OPTION_COST.specific;
    reward.specific = true;
    reward.specificMsg = specificMsg;
  }
  if (speed) {
    reward.tier += speed * OPTION_COST.speed;
    reward.speed = speed;
    reward.speedType = speedType;
  }
  if (stunned) {
    reward.tier += OPTION_COST.stunned * stunned;
    reward.stunned = stunned;
  }
  if (summon) {
    reward.tier += OPTION_COST.summon;
    reward.summon = true;
    reward.summonName = summonName;
  }
  if (summonTierIncrease) {
    reward.tier += summonTierIncrease * OPTION_COST.summonTierIncrease;
    reward.summonTierIncrease = summonTierIncrease;
  }
  if (teleport) {
    reward.tier += OPTION_COST.teleport;
    reward.teleport = true;
  }
  if (tierDecrease) {
    reward.tier -= tierDecrease;
    reward.tierDecrease = tierDecrease;
  }
  if (tierIncrease) {
    reward.tier += tierIncrease;
    reward.tierIncrease = tierIncrease;
  }
  if (trained) {
    reward.tier += OPTION_COST.trained;
    reward.trained = true;
    reward.trainedMsg = trainedMsg;
  }
  // TODO: get rid of upcastMax
  if (upcast) {
    reward.upcastMax = upcastMax;
    reward.tier += upcastMax;
    reward.upcast = upcast;
  }
  if (vulnerable.length) {
    reward.tier += vulnerable.length * OPTION_COST.vulnerable;
    reward.vulnerable = vulnerable;
  }
  if (wellspringMax) {
    reward.tier += wellspringMax * OPTION_COST.wellspringMax;
    reward.wellspringMax = wellspringMax;
  }
  if (wellspringRecover) {
    reward.tier += wellspringRecover * OPTION_COST.wellspringRecover;
    reward.wellspringRecover = wellspringRecover;
  }

  // must be last
  if (multiRewards && multiRewards.length) {
    reward.multiRewards = multiRewards;

    // find the highest action tier
    const highestActionTier = Math.max(
      ...multiRewards
        .filter(
          (r) => r.stage === STAGE.CHECK || r.stage === STAGE.ACTION || !r.stage
        )
        .map(initReward)
        .map((r) => r.tier),
      !reward.stage || reward.stage === STAGE.CHECK ? reward.tier : 0
    );
    // find highest defense tier
    const highestDefenseTier = Math.max(
      ...multiRewards
        .filter((r) => r.stage === STAGE.DEFENSE)
        .map(initReward)
        .map((r) => r.tier),
      reward.stage === STAGE.DEFENSE ? reward.tier : 0
    );
    // sum passive, move tiers
    let otherTiers = multiRewards
      .filter(
        (r) =>
          r.stage === STAGE.PASSIVE ||
          r.stage === STAGE.MOVE ||
          r.stage === STAGE.MINOR
      )
      .map(initReward)
      .map((r) => r.tier)
      .reduce((a, b) => a + b, 0);
    if (
      reward.stage === STAGE.PASSIVE ||
      reward.stage === STAGE.MOVE ||
      reward.stage === STAGE.MINOR
    ) {
      otherTiers += reward.tier;
    }

    reward.tier = highestActionTier + highestDefenseTier + otherTiers;
  }

  // if it is a trinket, return a tier value for filtering purposes
  if (type === REWARD_TYPE.TRINKET) {
    let tier = 0;
    let remaining = reward.price || 0;
    while (remaining / 10 > 2.5) {
      tier += 1;
      remaining /= 10;
    }
    reward.tier = tier;
  }

  if (overrideTier !== undefined && overrideTier !== null) {
    reward.tier = reward.overrideTier = overrideTier;
  }

  return reward;
}

export function migrateRewardData(reward: any): RewardData {
  const newData: RewardData = {
    ...reward,
  };
  if (!reward.stage) {
    newData.stage = STAGE.CHECK;
  }
  if (typeof reward.stunned === "boolean") {
    newData.stunned = reward.stunned ? 1 : 0;
  }
  if (typeof reward.restrained === "boolean") {
    newData.restrained = reward.restrained ? 1 : 0;
  }

  // remove junk data
  if (reward.reduceDamage === 0) {
    delete newData.reduceDamage;
  }
  if (reward.trained === false) {
    delete newData.trained;
  }
  if (reward.cost === 0) {
    delete newData.cost;
  }
  if (reward.advantage === false) delete newData.advantage;
  if (reward.disadvantage === false) delete newData.disadvantage;
  if (reward.aoe === false) {
    delete newData.aoe;
  }
  if (reward.avoidAllies === false) {
    delete newData.avoidAllies;
  }
  if (!reward.trainedMsg) {
    delete newData.trainedMsg;
  }
  if (reward.resistant && !reward.resistant.length) {
    delete newData.resistant;
  }
  if (reward.immune && !reward.immune.length) {
    delete newData.immune;
  }
  if (reward.vulnerable && !reward.vulnerable.length) {
    delete newData.vulnerable;
  }
  if (reward.imposeVulnerable && !reward.imposeVulnerable.length) {
    delete newData.imposeVulnerable;
  }
  if (!reward.rangeIncrease || reward.rangeIncrease < 1) {
    delete newData.rangeIncrease;
  }

  return newData;
}

export function maxDamageReduction(reward: Reward | RewardData): number {
  if (!isReward(reward)) {
    reward = initReward(reward);
  }
  const base = reward.reduceDamage || 0;
  const upcastGives = reward.upcast ? reward.upcast.reduceDamage || 0 : 0;
  return base + (reward.upcastMax || 0) * upcastGives;
}

export const conditionNotYetApplied = (
  condition: Condition,
  pc: PC,
  enemy?: Enemy
): boolean => {
  const defenseAdv = hasAdv("defense", pc.conditions, enemy?.conditions || []);
  const actionAdv = hasAdv("action", pc.conditions, enemy?.conditions || []);

  // Imposed on pcs by pcs
  if (
    [PC_STATUS.ADV_ACT, ENEMY_STATUS.ADV_ACT_AGAINST].includes(condition.status)
  )
    return actionAdv.rollWith !== "ADV";
  if (
    [PC_STATUS.ADV_DEFEND, ENEMY_STATUS.ADV_DEFEND_AGAINST].includes(
      condition.status
    )
  )
    return defenseAdv.rollWith !== "ADV";

  // Imposed on pcs by enemies
  if (
    [PC_STATUS.DADV_ACT, ENEMY_STATUS.ADV_ACT_AGAINST].includes(
      condition.status
    )
  )
    return actionAdv.rollWith !== "DADV";
  if (
    [PC_STATUS.DADV_DEFEND, ENEMY_STATUS.ADV_DEFEND_AGAINST].includes(
      condition.status
    )
  )
    return defenseAdv.rollWith !== "DADV";

  // Already have training
  if (condition.status === PC_STATUS.TRAINED_ACT)
    return !pc.conditions.some((c) => c.status === PC_STATUS.TRAINED_ACT);
  if (condition.status === PC_STATUS.TRAINED_DEFEND)
    return !pc.conditions.some((c) => c.status === PC_STATUS.TRAINED_DEFEND);
  if (condition.status === PC_STATUS.TRAINED_HEAL)
    return !pc.conditions.some((c) => c.status === PC_STATUS.TRAINED_HEAL);

  return true;
};

// decrement durations and get a new array of conditions that are still up
export const decrementConditionDurations = (
  // if this is the top of the round or the bottom of the round
  time: "top" | "bottom",
  creature: PC | Enemy
) => {
  const conditions = creature.conditions.filter((c) => c.ends === time);
  // decrement durations of conditions
  conditions.forEach((c) => (c.duration ? c.duration-- : null));
  const removed = conditions.filter((c) => {
    const remove = c.duration === 0 || (c.duration && c.duration <= 0);
    if (remove) {
      logger.debug(
        `${
          creature.type === "pc" ? creature.name : `enemy ${creature.number}`
        }: decrementConditionDurations - Removing condition "${c.name}"`,
        c,
        creature
      );
    }
    return remove;
  });
  creature.conditions = creature.conditions.filter((c) => !removed.includes(c));
};

export function getRewardDC(reward: Reward): number {
  return getDCHard(reward.tier);
}

export function validateRewardData(options: RewardData): {
  errors: string[];
  valid: boolean;
} {
  const errors: string[] = [];

  if (options.type === REWARD_TYPE.TRINKET) return { errors, valid: true };

  const reward = initReward(options);
  if (reward.tier < 0) {
    errors.push(`Tier is negative (${reward.tier})`);
  }

  if (
    options.advantage &&
    !options.advantageMsg &&
    options.stage !== STAGE.CHECK &&
    options.stage !== STAGE.DEFENSE
  ) {
    errors.push(
      "Advantage must specify under which conditions you may roll with advantage"
    );
  }
  if (!options.aoe && options.avoidAllies) {
    errors.push("Cannot avoid allies without being an AoE attack");
  }
  if (options.castTime && !options.castTimeMsg) {
    errors.push("If it has a cast time, you must specify the cast time");
  }
  if (options.disadvantage && !options.disadvantageMsg) {
    errors.push(
      "Disadvantage must specify under which conditions you may roll with disadvantage"
    );
  }
  if (options.duration && !options.durationMsg) {
    errors.push("If it has a duration, you must specify the duration");
  }
  if (
    options.grantsAbilities &&
    options.grantsAbilities.length &&
    !options.instructions
  ) {
    const emptyAbilities = options.grantsAbilities.filter((a) => a === "");
    if (emptyAbilities.length) {
      errors.push("Abilities need a description");
    }
  }
  if (options.onAutoSuccess && options.onSuccess) {
    errors.push("Cannot have both On Auto Success and On Success");
  }
  if (options.rangeIncrease && !options.ranged && !options.aoe) {
    errors.push("Cannot increase range if it is not a ranged reward");
  }
  if (options.ranged && options.meleeAndRanged) {
    errors.push("Cannot be both ranged and melee and ranged");
  }
  if (options.meleeAndRanged && options.rangeIncrease) {
    errors.push("Cannot increase range if both melee and ranged");
  }
  if (options.relentless && !options.relentlessMsg) {
    errors.push("Relentless must specify which pool(s) it affects");
  }
  if (options.relentless && !options.cost && !options.consumable) {
    errors.push("If it is relentless, it must have a cost or be consumable");
  }
  if (options.specific && !options.specificMsg) {
    errors.push(
      "If it is specific, you must specify the scenario in which it can be used"
    );
  }
  if (options.teleport && options.noChase) {
    errors.push("If you teleport, you already cannot be chased.");
  }
  if (options.upcast && initReward(options.upcast).tier !== -1) {
    errors.push("Upcast reward must have a tier of -1");
  }
  if (options.wellspringRecover && !options.consumable) {
    errors.push("If it recovers wellspring, it must be consumable");
  }
  if (options.heals && !options.cost && !options.consumable) {
    errors.push("If it heals, it must have a wellspring cost or be consumable");
  }

  // check for limits on stage
  for (const attribute in options) {
    if (
      options.stage &&
      !!options[attribute as keyof RewardData] &&
      REWARD_STAGE_LIMITS[attribute] &&
      REWARD_STAGE_LIMITS[attribute][options.stage] === false
    ) {
      errors.push(
        `Attribute "${attribute}" is not allowed in stage "${options.stage}"`
      );
    }
  }

  const valid = errors.length === 0;
  return { errors, valid };
}

export function getRewardDataFromId(
  id: RewardDataID,
  rewards: RewardData[]
): RewardData | undefined {
  return rewards.find((r) => r.id === id);
}

export function getRewardDataFromIds(
  ids: RewardDataID[],
  rewards: RewardData[]
): RewardData[] {
  const results = ids.map((id) => rewards.find((r) => r.id === id));
  return results.filter((r) => r) as RewardData[];
} // ignore name

export const isSameReward = (a: RewardData, b: RewardData) => {
  const isSame =
    JSON.stringify({ ...a, name: "" }) === JSON.stringify({ ...b, name: "" });
  logger.debug(`isSameReward: ${isSame}`, a, b);
  return isSame;
};

export const getWellspringCost = (reward: Reward): number => {
  if (!reward.cost) return 0;

  const originalTier = reward.tier + reward.cost - 1;
  return Math.max(originalTier * reward.cost, 1);
};