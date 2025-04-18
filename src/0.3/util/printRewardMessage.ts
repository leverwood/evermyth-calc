import { Reward, STAGE } from "../../rewards/types/reward-types";
import { printModifier } from "../../0.2/util/dice-calcs-0.2";
// import { LOG_LEVEL, Logger } from "../../util/log";
import { getWellspringCost, initReward } from "../../rewards/util/reward-calcs";

// const logger = Logger(LOG_LEVEL.INFO);

// for a single reward, doesn't account for multi-rewards
// TODO: conditions
export const printRewardMessage = (
  reward: Reward,
  isUpcast = false,
  ignoreInstructions = false,
  isCreature = false
): string => {
  const messages: string[] = [];

  if (
    reward.instructions &&
    reward.instructions.length &&
    !ignoreInstructions
  ) {
    messages.push(reward.instructions);
  } else {
    const aoeCreatures = reward.avoidAllies
      ? "creatures you choose"
      : "all creatures";
    const rangedZoneSize = reward.rangeIncrease
      ? reward.rangeIncrease * 2 + 2
      : (reward.meleeAndRanged || reward.rangeDecrease)
      ? 1
      : 2;
    const aoeZoneSize = reward.aoe
      ? reward.aoeSizeIncrease
        ? reward.aoeSizeIncrease + 1
        : 1
      : 0;
    const aoeZoneMsg = `${aoeZoneSize} zone${aoeZoneSize > 1 ? "s" : ""}`;
    const healPoints =
      reward.stage === STAGE.ACTION && reward.heals > 1 && reward.heals <= 6
        ? `1d${reward.heals * 2}`
        : reward.heals;
    const dealPoints =
      reward.stage === STAGE.ACTION && reward.deals > 1 && reward.deals <= 6
        ? `1d${reward.deals * 2}`
        : reward.deals;

    if (reward.specificMsg) messages.push(reward.specificMsg);

    // Decide to cast it
    if (reward.castTimeMsg) messages.push(reward.castTimeMsg);

    if (reward.ranged) messages.push(`range ${rangedZoneSize}`);
    if (reward.meleeAndRanged) messages.push("melee, range: 1");
    if (reward.relentless)
      messages.push(
        `when ${reward.relentlessMsg} is depleted, drop to 1 instead`
      );

    // ROLL
    if (reward.onSuccess) messages.push(`on success`);
    if (reward.onAutoSuccess) messages.push(`on auto success`);
    if (reward.trained)
      messages.push(
        `${!reward.trainedMsg ? "roll with " : ""}training${
          reward.trainedMsg ? ": " : ""
        }` + reward.trainedMsg || ""
      );
    if (reward.advantage) {
      messages.push(
        reward.advantageMsg
          ? `advantage ` + reward.advantageMsg
          : "roll with advantage"
      );
    }
    if (reward.disadvantage)
      messages.push(`disadvantage ` + reward.disadvantageMsg || "");

    // movement
    if (reward.teleport) {
      messages.push(
        `teleport up to ${reward.speed ? reward.speed + 1 : 1} zone${
          reward.speed ? "s" : ""
        }`
      );
    } else {
      if (reward.speed)
        messages.push(
          `+${reward.speed} ${
            reward.speedType ? `${reward.speedType} ` : ""
          }speed`
        );
      if (reward.noChase) messages.push(`can't be chased`);
    }
    if (reward.summon)
      messages.push(
        `summon a tier ${reward.summonTierIncrease || 0} ${
          reward.summonName
        }, you may only have 1 summon at a time`
      );
    if (!reward.summon && reward.summonTierIncrease) {
      messages.push(`+${reward.summonTierIncrease} summon tier`);
    }

    // IMPOSE VULNERABLE
    if (reward.imposeVulnerable) {
      messages.push(
        `target becomes vulnerable to ${reward.imposeVulnerable.join(", ")}`
      );
    }

    // DEAL OR HEAL
    if (reward.deals) {
      messages.push(
        `deal ${
          isUpcast ||
          reward.stage === STAGE.MINOR ||
          reward.stage === STAGE.PASSIVE
            ? printModifier(reward.deals)
            : dealPoints
        }${reward.aoe ? " to " + aoeCreatures + ` in ${aoeZoneMsg}` : ""}`
      );
    }
    if (!reward.deals && reward.aoe) {
      messages.push(`affects ${aoeCreatures} in ${aoeZoneMsg}`);
    }
    if (reward.heals) {
      messages.push(
        `heals ${healPoints}${
          reward.aoe
            ? " to " +
              (reward.avoidAllies
                ? "creatures of your choice"
                : "all creatures") +
              " in a zone"
            : ""
        }`
      );
    }
    if (reward.lingeringDamage) {
      messages.push(
        `deals ${reward.lingeringDamage} dmg at the end of their turns unless an action is taken to end the effect`
      );
    }

    if (reward.reduceMaxPool) {
      messages.push(
        `reduce max pool by ${reward.reduceMaxPool} until a full reset`
      );
    }

    // STUNNED OR RESTRAINED
    if (reward.restrained)
      messages.push(
        `set ${
          reward.aoe ? `creatures'` : "a creature's"
        }  speed to 0 (creature tier of ${reward.restrained * 2} or less)`
      );
    if (reward.stunned)
      messages.push(
        `stun ${reward.aoe ? `creatures` : "a creature"} with ${
          reward.aoe ? `tiers` : "a tier"
        } of ${reward.stunned * 2} or less`
      );

    // GRANTS ABILITIES
    if (reward.grantsAbilities && reward.grantsAbilities.length) {
      reward.grantsAbilities.forEach((ability) => {
        if (ability) messages.push(ability);
      });
    }

    // TAKE DAMAGE
    if (reward.resistant?.length) {
      messages.push(`resistances: ${reward.resistant.join(", ")}`);
    }
    if (reward.vulnerable?.length) {
      messages.push(`vulnerabilities: ${reward.vulnerable.join(", ")}`);
    }
    if (reward.immune?.length) {
      messages.push(`immunities: ${reward.immune.join(", ")}`);
    }
    if (reward.reduceDamage) {
      messages.push(
        `reduce dmg ${reward.reduceDamage > 1 ? "up to " : "by "}${
          reward.reduceDamage
        } for 1 WS${reward.reduceDamage > 1 ? " each" : ""}`
      );
    }

    // WELLSPRING EFFECTS
    if (reward.wellspringRecover)
      messages.push(`recovers ${reward.wellspringRecover}d4 WS`);
    if (reward.wellspringMax)
      messages.push(`increase max WS by ${reward.wellspringMax}`);

    // this must go before "roll to maintain" messages
    if (reward.onFailTakeDamage) {
      messages.push(
        `on fail take ${reward.onFailTakeDamage} dmg to ${reward.onFailDmgType}`
      );
    }

    if (reward.stunned)
      messages.push(
        "roll to maintain the stun if an action is used to break it"
      );
    if (reward.restrained)
      messages.push(
        "roll to maintain the effect if an action is used to break it"
      );

    // duration should be near last
    if (reward.durationMsg) messages.push(reward.durationMsg);

    // ammo cost should be near last
    if (reward.requiresAmmo) messages.push("requires ammo");

    // cost should be last
    if (reward.consumable)
      messages.push(isCreature ? `costs ${reward.tier + 1} WS` : "single use");
    if (reward.cost)
      messages.push(`costs ${getWellspringCost(reward)} WS`);

    // add stage label
    if (messages.length) {
      messages[0] = `(${reward.stage?.toLowerCase()}) ` + messages[0];
    }

    if (reward.suffix) messages.push(reward.suffix);

    if (reward.prefix) messages.unshift(reward.prefix);
  }

  if (reward.multiRewards) {
    reward.multiRewards.forEach((opt) =>
      messages.push(
        `\n\n**${opt.name}.** ` + printRewardMessage(initReward(opt))
      )
    );
  }

  if (reward.curse) {
    messages.push(`\n\n**Curse.** ${reward.curseMsg}`);
  }

  if (reward.flavor) {
    messages.push(`\n\n*${reward.flavor}*`);
  }

  // merge lines where one line starts with \n
  // this is so there aren't commas at the end of the previous line
  let i = 1;
  while (i < messages.length) {
    if (messages[i].startsWith("\n")) {
      messages[i - 1] += messages[i];
      messages.splice(i, 1);
    } else i++;
  }
  for (let i = 1; i < messages.length; i++) {}

  return messages.filter((m) => m.length).join(", ");
};
