import { OPTION_COST } from "../types/reward-types";
import { printModifier } from "../../0.2/util/dice-calcs-0.2";

export const DESCRIPTIONS: {
  [key: string]: JSX.Element;
} = {
  advantage: (
    <>
      <strong>Advantage.</strong> Under condition:
    </>
  ),
  aoe: (
    <>
      <strong>Area of Effect.</strong> Affect all creatures in a zone
    </>
  ),
  avoidAllies: (
    <>
      <strong>Avoid Allies.</strong> Area of Effect avoids allies
    </>
  ),
  castTime: (
    <>
      <strong>Cast time.</strong> The casting time is increased, or the effect
      is delayed in some way. You can apply this multiple times for a high cast
      time. Cast time description:
    </>
  ),
  consumable: (
    <>
      <strong>Single use</strong>
    </>
  ),
  cost: (
    <>
      <strong>Wellspring Cost.</strong> costs +1 wellspring
    </>
  ),
  deals: (
    <>
      <strong>Deal</strong> +1 points. Must require a check.
    </>
  ),
  disadvantage: (
    <>
      <strong>Disadvantage.</strong> Under condition:
    </>
  ),
  duration: (
    <>
      <strong>Duration.</strong> Increase the duration of the effect. You can
      apply this multiple times if the duration is exceptionally long. Duration:
    </>
  ),
  grantsAbilities: (
    <>
      <strong>Grants ability or applies a condition.</strong> Ability or
      condition:
    </>
  ),
  heals: (
    <>
      <strong>Heals</strong> +1 points
    </>
  ),
  isMove: (
    <>
      <strong>Is movement.</strong> Use this reward during your move on your
      turn. It doesn't require a roll. Cannot deal points or heal.
    </>
  ),
  lingeringDamage: (
    <>
      <strong>Lingering Damage.</strong> Deal +1 damage at the end of their turn
      unless an action is taken to end the effect.
    </>
  ),
  noAction: (
    <>
      <strong>No Action.</strong> If this reward is used during your turn, it
      doesn't take an action. It also doesn't require a check.
    </>
  ),
  noChase: (
    <>
      <strong>No Chase.</strong> Can't be chased by enemies.
    </>
  ),
  noCheck: (
    <>
      <strong>No Roll</strong> is required
    </>
  ),
  onFailTakeDamage: (
    <>
      <strong>On Fail Take Damage.</strong> If the check fails, take -1 to the
      pool of the ability you used.
    </>
  ),
  ranged: (
    <>
      <strong>Ranged.</strong> Can target 1 nearby zone.
    </>
  ),
  rangeIncrease: (
    <>
      <strong>Range Increase.</strong> Can target a zone +2 further away.
    </>
  ),
  reduceDamage: (
    <>
      <strong>Reduce Damage</strong> by +1 after a failed defense roll (must
      cost wellspring or be single use). Does not require an additional check.
    </>
  ),
  relentless: (
    <>
      <strong>Relentless.</strong> When the following pool(s) hit zero, return
      with 1 pool instead:
    </>
  ),
  restrained: (
    <>
      <strong>Restrained.</strong> Set a creature's speed to 0 with a tier of 2
      or less. Make a check to maintain the effect if the target or an ally uses
      an action to break them free. Apply multiple times to increase the tier
      limit.
    </>
  ),
  requiresAmmo: (
    <>
      <strong>Requires Ammo.</strong> Requires ammunition to use. Ammunition
      takes another gear slot.
    </>
  ),
  specific: (
    <>
      <strong>Specific.</strong> Can only be used in a specific scenario:
    </>
  ),
  speed: (
    <>
      <strong>Speed.</strong> Increase your speed by +1 zone
    </>
  ),
  stunned: (
    <>
      <strong>Stunned.</strong> Stun a creature with a tier of 2 or less. Make a
      check to maintain the stun if the target uses an action to break free.
      Apply multiple times to increase the tier limit.
    </>
  ),
  summon: (
    <>
      <strong>Summon</strong> a tier 0 creature
    </>
  ),
  summonTierIncrease: (
    <>
      <strong>Summon Tier Increase.</strong> Increase the tier of the summon by
      1
    </>
  ),
  teleport: (
    <>
      <strong>Teleport</strong> up to your speed. Does not provoke a chase.
    </>
  ),
  trained: (
    <>
      <strong>Trained.</strong> Gain training for something specific:
    </>
  ),
  upcast: (
    <>
      <strong>Upcast.</strong> Spend more wellspring to apply a stronger effect.
      Select a reward with a tier of -1:
    </>
  ),
  wellspringMax: (
    <>
      <strong>Wellspring max.</strong> Increase by +1
    </>
  ),
  wellspringRecover: (
    <>
      <strong>Wellspring Recovery.</strong> +1d4 wellspring. Reward must be
      single use.
    </>
  ),
  whileDefending: (
    <>
      <strong>Defending.</strong> Can be used while making a defense roll.
    </>
  ),
} as const;

export default function AttributeDescription({
  keyName,
}: {
  keyName: keyof typeof DESCRIPTIONS;
}) {
  const cost = OPTION_COST[keyName];
  const content = DESCRIPTIONS[keyName];
  return (
    <span>
      ({printModifier(cost)} tier) {content || "Key not found"}
    </span>
  );
}
