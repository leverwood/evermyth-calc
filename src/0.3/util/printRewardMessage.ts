import { Reward } from "../types/reward-types-new";
import { printModifier } from "../../0.2/util/dice-calcs-0.2";
import { logger } from "./reward-calcs";

// for a single reward, doesn't account for multi-rewards
// TODO: conditions
export const printRewardMessage = (
  reward: Reward,
  isUpcast = false
): string => {
  logger.debug(reward.name);
  if (reward.name === "Golem Familiar") {
    logger.debug(
      `Golem Familiar! getRewardMessage: returning description for reward ${reward.name}`
    );
  }
  if (reward.instructions && reward.instructions.length) {
    logger.debug(
      `getRewardMessage: returning description for reward ${reward.name}`
    );
    return reward.instructions;
  }

  if (reward.multiRewards && reward.multiRewards.length) {
    return reward.multiRewards.map((r) => r.name).join(", ");
  }

  const messages = [];
  if (reward.specificMsg) messages.push(reward.specificMsg);

  // Decide to cast it
  if(reward.whileDefending) messages.push("while defending");
  if (reward.castTimeMsg) messages.push(reward.castTimeMsg);
  if (reward.consumable) messages.push("single use");
  if (reward.noAction) messages.push("no action");
  else if (reward.noCheck) messages.push("no check");
  if (reward.ranged && !reward.rangeIncrease) messages.push("ranged");
  else if (reward.rangeIncrease)
    messages.push(`range of ${reward.rangeIncrease + 1} zones`);
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

  // ROLL
  if (reward.trained) messages.push(reward.trainedMsg);
  if (reward.advantage) messages.push(reward.advantageMsg);
  if (reward.disadvantage) messages.push(reward.disadvantageMsg);

  // DEAL OR HEAL
  if (reward.deals)
    messages.push(
      `deal ${isUpcast ? printModifier(reward.deals): reward.deals} point${
        reward.aoe
          ? " to " +
            (reward.avoidAllies
              ? "creatures of your choice"
              : "all creatures") +
            " in a zone"
          : ""
      }${reward.deals > 1 ? "s" : ""}`
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
  if (reward.reduceDamage)
    messages.push(`reduce damage by ${reward.reduceDamage}`);
  if (reward.wellspringRecover)
    messages.push(`recovers ${reward.wellspringRecover}d4 wellspring`);

  if (reward.wellspringMax)
    messages.push(`increase max wellspring by ${reward.wellspringMax}`);

  if (reward.grantsAbilities && reward.grantsAbilities.length)
    messages.push(...reward.grantsAbilities);

  // duration should be near last
  if (reward.durationMsg) messages.push(reward.durationMsg);

  // cost should be last
  if (reward.cost) messages.push(`costs ${reward.cost} wellspring`);

  return messages.join(", ");
};
