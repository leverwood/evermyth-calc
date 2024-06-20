import { Reward } from "../../rewards/types/reward-types";
import { printModifier } from "../../0.2/util/dice-calcs-0.2";
import { LOG_LEVEL, Logger } from "../../util/log";
import { initReward } from "../../rewards/util/reward-calcs";

const logger = Logger(LOG_LEVEL.INFO);

// for a single reward, doesn't account for multi-rewards
// TODO: conditions
export const printRewardMessage = (
  reward: Reward,
  isUpcast = false,
  ignoreInstructions = false
): string => {
  const messages: string[] = [];

  if (
    reward.instructions &&
    reward.instructions.length &&
    reward.multiRewards &&
    reward.multiRewards.length &&
    !ignoreInstructions
  ) {
    reward.multiRewards.forEach((opt) =>
      messages.push(
        `***${reward.name}.*** ${printRewardMessage(initReward(opt))}`
      )
    );
    return messages.join("\n");
  }
  if (
    reward.instructions &&
    reward.instructions.length &&
    !ignoreInstructions
  ) {
    return reward.instructions;
  }

  if (reward.specificMsg) messages.push(reward.specificMsg);

  // Decide to cast it
  if (reward.whileDefending) messages.push("while defending");
  if (reward.castTimeMsg) messages.push(reward.castTimeMsg);
  if (reward.ranged && !reward.rangeIncrease)
    messages.push("range: 1 zone away");
  else if (reward.rangeIncrease)
    messages.push(`range: ${reward.rangeIncrease + 1} zones away`);
  if (reward.relentless)
    messages.push(
      `when ${reward.relentlessMsg} is depleted, drop to 1 instead`
    );
  if (reward.restrained)
    messages.push(
      "restrain a creature so it cannot move, make a check to maintain the effect if they attempt to break free"
    );
  if (reward.stunned)
    messages.push(
      "stun a creature so it cannot act or move, make a check to maintain the effect if a creature attempts to help them"
    );
  // movement
  if (reward.teleport) {
    messages.push(
      `teleport up to ${reward.speed ? reward.speed + 1 : 1} zone${
        reward.speed ? "s" : ""
      } away`
    );
  } else {
    if (reward.speed) messages.push(`speed is ${reward.speed + 1}`);
    if (reward.noChase) messages.push(`can't be chased`);
  }
  if (reward.summon)
    messages.push(`summon a tier ${reward.summonTierIncrease || 0} creature`);
  if (!reward.summon && reward.summonTierIncrease) {
    messages.push(`+${reward.summonTierIncrease} summon tier`);
  }

  // DEAL OR HEAL
  if (reward.deals)
    messages.push(
      `deal ${isUpcast ? printModifier(reward.deals) : reward.deals} point${
        reward.deals > 1 ? "s" : ""
      }${
        reward.aoe
          ? " to " +
            (reward.avoidAllies
              ? "creatures of your choice"
              : "all creatures") +
            " in a zone"
          : ""
      }`
    );
  if (reward.heals) {
    messages.push(
      `heals ${reward.heals} point${
        reward.aoe
          ? " to " +
            (reward.avoidAllies
              ? "creatures of your choice"
              : "all creatures") +
            " in a zone"
          : ""
      }${reward.heals > 1 ? "s" : ""}`
    );
  }
  if (reward.lingeringDamage) {
    messages.push(
      `deals ${reward.lingeringDamage} damage at the end of their turn unless an action is taken to end the effect`
    );
  }
  if (reward.reduceDamage)
    messages.push(`reduce damage by ${reward.reduceDamage}`);
  if (reward.wellspringRecover)
    messages.push(`recovers ${reward.wellspringRecover}d4 wellspring`);

  if (reward.wellspringMax)
    messages.push(`increase max wellspring by ${reward.wellspringMax}`);

  if (reward.grantsAbilities && reward.grantsAbilities.length) {
    reward.grantsAbilities.forEach((ability) => {
      if (ability) messages.push(ability);
    });
  }

  // ROLL
  if (reward.trained) messages.push(reward.trainedMsg || "");
  if (reward.advantage) messages.push(reward.advantageMsg || "");
  if (reward.disadvantage) messages.push(reward.disadvantageMsg || "");
  if (reward.noAction) messages.push("no action");
  else if (reward.noCheck) messages.push("no check");

  // duration should be near last
  if (reward.durationMsg) messages.push(reward.durationMsg);

  // ammo cost should be near last
  if (reward.requiresAmmo) messages.push("requires ammunition");

  // cost should be last
  if (reward.consumable) messages.push("single use");
  if (reward.cost) messages.push(`costs ${reward.cost} wellspring`);

  if (reward.multiRewards) {
    reward.multiRewards.forEach((opt) =>
      messages.push(printRewardMessage(initReward(opt)))
    );
  }

  return messages
    .map((m) => m.trim())
    .filter((m) => m.length)
    .join(", ");
};
