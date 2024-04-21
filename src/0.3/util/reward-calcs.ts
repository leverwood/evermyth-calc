import {
  REWARD_TYPE,
  RewardOptions,
  Reward,
  OPTION_COST,
  isReward,
} from "../types/reward-types-new";
import {
  Condition,
  ENEMY_STATUS,
  Enemy,
  PC_STATUS,
  PC,
  isBeneficialStatus,
  isEnemyStatus,
} from "../types/types-new-system";
import { getDCHard } from "./enemy-calc";
import { LOG_LEVEL, Logger } from "../../util/log";
import { hasAdv } from "./pc-calcs";

export const logger = Logger(LOG_LEVEL.ERROR);

export function initReward({
  name = "",
  advantage = false,
  advantageMsg = "",
  aoe = false,
  avoidAllies = false,
  castTime = 0,
  castTimeMsg = "",
  conditions = [],
  consumable = false,
  cost = 0,
  deals = 0,
  disadvantage = false,
  disadvantageMsg = "",
  duration = 0,
  durationMsg = "",
  grantsAbilities = [],
  heals = 0,
  instructions,
  isMove = false,
  multiRewards = [],
  noAction = false,
  noChase = false,
  noCheck = false,
  notes = "",
  ranged = false,
  rangeIncrease = 0,
  reduceDamage = 0,
  relentless = false,
  relentlessMsg = "",
  restrained = false,
  specific = false,
  specificMsg = "",
  speed = 0,
  stunned = false,
  summon = false,
  summonTierIncrease = 0,
  teleport = false,
  trained = false,
  trainedMsg = "",
  type = REWARD_TYPE.EQUIPMENT,
  upcast,
  upcastMax = 0,
  wellspringMax = 0,
  wellspringRecover = 0,
  whileDefending = false,
}: RewardOptions): Reward {
  const reward: Reward = {
    __typename: "Reward",
    name,
    deals: 0,
    heals: 0,
    cost: 0,
    tier: -1,
    type,
  };
  if (advantage) {
    reward.tier += OPTION_COST.advantage;
    reward.advantage = true;
    reward.advantageMsg = advantageMsg;
  }
  if (aoe) {
    reward.tier += OPTION_COST.aoe;
    reward.aoe = true;
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
  if (instructions) {
    reward.instructions = instructions;
  }
  if (isMove) {
    reward.isMove = true;
  }
  if (multiRewards && multiRewards.length) {
    const multiRewardsResult = multiRewards.map(initReward);
    reward.multiRewards = multiRewardsResult;
    let maxTier = 0;
    for (const r of multiRewardsResult) {
      if (r.tier > maxTier) maxTier = r.tier;
    }
    reward.tier = maxTier;
  }
  if (noAction) {
    reward.tier += OPTION_COST.noAction;
    reward.noAction = true;
  }
  if (noChase) {
    reward.tier += OPTION_COST.noChase;
    reward.noChase = true;
  }
  if (noCheck) {
    reward.tier += OPTION_COST.noCheck;
    reward.noCheck = true;
  }
  if (notes) {
    reward.notes = notes;
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
  if (restrained) {
    reward.tier += OPTION_COST.restrained;
    reward.restrained = true;
  }
  if (specific) {
    reward.tier += OPTION_COST.specific;
    reward.specific = true;
    reward.specificMsg = specificMsg;
  }
  if (speed) {
    reward.tier += speed * OPTION_COST.speed;
    reward.speed = speed;
  }
  if (stunned) {
    reward.tier += OPTION_COST.stunned;
    reward.stunned = true;
  }
  if (summon) {
    reward.tier += OPTION_COST.summon;
    reward.summon = true;
  }
  if (summonTierIncrease) {
    reward.tier += summonTierIncrease * OPTION_COST.summonTierIncrease;
    reward.summonTierIncrease = summonTierIncrease;
  }
  if (teleport) {
    reward.tier += OPTION_COST.teleport;
    reward.teleport = true;
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
  if (wellspringMax) {
    reward.tier += wellspringMax * OPTION_COST.wellspringMax;
    reward.wellspringMax = wellspringMax;
  }
  if (wellspringRecover) {
    reward.tier += wellspringRecover * OPTION_COST.wellspringRecover;
    reward.wellspringRecover = wellspringRecover;
  }
  if(whileDefending){
    reward.whileDefending = true;
    reward.tier += OPTION_COST.whileDefending;
  }

  return reward;
}

export function maxDamageReduction(reward: Reward | RewardOptions): number {
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

export function validateRewardOptions(options: RewardOptions): {
  errors: string[];
  valid: boolean;
} {
  const errors: string[] = [];

  if (options.type === REWARD_TYPE.TRAINING) {
    return {
      errors: [],
      valid: true,
    };
  }

  const reward = initReward(options);
  if (reward.tier < 0) {
    errors.push(
      `Tier is negative (${reward.tier}), so it will be considered tier 0`
    );
  }

  if (options.advantage && !options.advantageMsg) {
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
  // if(options.deals && (options.noCheck || options.noAction)){
  //    errors.push("If it deals damage, it must require a check and an action")
  // }
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
  if (options.isMove && (options.deals || options.heals)) {
    errors.push("If it is a movement, it cannot deal or heal points");
  }
  if (options.noCheck && options.noAction) {
    errors.push(
      "If it doesn't take an action, it already doesn't take a check"
    );
  }
  if (options.rangeIncrease && !options.ranged) {
    errors.push("Cannot increase range if it is not a ranged reward");
  }
  if (options.reduceDamage && !options.cost && !options.consumable) {
    errors.push("If it reduces damage, it must have a cost or be consumable");
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
  const valid = errors.length === 0;
  return { errors, valid };
}
