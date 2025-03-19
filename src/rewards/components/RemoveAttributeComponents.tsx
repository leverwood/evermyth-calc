import RemoveStunned from "./attributes/RemoveStunned";
import RemoveSummon from "./attributes/RemoveSummon";
import RemoveRelentless from "./attributes/RemoveRelentless";
import RemoveAoe from "./attributes/RemoveAoe";
import RemoveAvoidAllies from "./attributes/RemoveAvoidAllies";
import RemoveLingeringDamage from "./attributes/RemoveLingeringDamage";
import RemoveTeleport from "./attributes/RemoveTeleport";
import RemoveSummonTierIncrease from "./attributes/RemoveSummonTierIncrease";
import RemoveDeals from "./attributes/RemoveDeals";
import RemoveHeals from "./attributes/RemoveHeals";
import RemoveReduceDamage from "./attributes/RemoveReduceDamage";
import RemoveGrantsAbilities from "./attributes/RemoveGrantsAbilities";
import RemoveWellspringMax from "./attributes/RemoveWellspringMax";
import RemoveWellspringRecover from "./attributes/RemoveWellspringRecover";
import RemoveRestrained from "./attributes/RemoveRestrained";
import RemoveSpeed from "./attributes/RemoveSpeed";
import RemoveDuration from "./attributes/RemoveDuration";
import RemoveAdvantage from "./attributes/RemoveAdvantage";
import RemoveRangeIncrease from "./attributes/RemoveRangeIncrease";
import RemoveRequiresAmmo from "./attributes/RemoveRequiresAmmo";
import RemoveRanged from "./attributes/RemoveRanged";
import RemoveTrained from "./attributes/RemoveTrained";
import RemoveUpcast from "./attributes/RemoveUpcast";
import RemoveDisadvantage from "./attributes/RemoveDisadvantage";
import RemoveCost from "./attributes/RemoveCost";
import RemoveCastTime from "./attributes/RemoveCastTime";
import RemoveSpecific from "./attributes/RemoveSpecific";
import RemoveConsumable from "./attributes/RemoveConsumable";
import RemoveOnFailTakeDamage from "./attributes/RemoveOnFailTakeDamage";
import { RewardData } from "../types/reward-types";
import RemoveMeleeAndRangedAttribute from "./attributes/RemoveMeleeAndRanged";
import RemoveCurse from "./attributes/RemoveCurse";
import RemoveTierDecrease from "./attributes/RemoveTierDecrease";
import RemoveTierIncrease from "./attributes/RemoveTierIncrease";
import RemoveOnSuccess from "./attributes/RemoveOnSuccess";
import RemoveOnAutoSuccess from "./attributes/RemoveOnAutoSuccess";
import RemoveSuffix from "./attributes/RemoveSuffix";
import RemovePrefix from "./attributes/RemovePrefix";
import RemoveFlavor from "./attributes/RemoveFlavor";

export const attributeComponents: readonly {
  key: keyof RewardData;
  component: React.FC<any>;
}[] = [
  { key: "stunned", component: RemoveStunned },
  { key: "summon", component: RemoveSummon },
  { key: "relentless", component: RemoveRelentless },
  { key: "aoe", component: RemoveAoe },
  { key: "avoidAllies", component: RemoveAvoidAllies },
  { key: "lingeringDamage", component: RemoveLingeringDamage },
  { key: "teleport", component: RemoveTeleport },
  { key: "summonTierIncrease", component: RemoveSummonTierIncrease },
  { key: "trained", component: RemoveTrained },
  { key: "advantage", component: RemoveAdvantage },
  { key: "deals", component: RemoveDeals },
  { key: "heals", component: RemoveHeals },
  { key: "reduceDamage", component: RemoveReduceDamage },
  { key: "grantsAbilities", component: RemoveGrantsAbilities },
  { key: "wellspringMax", component: RemoveWellspringMax },
  { key: "wellspringRecover", component: RemoveWellspringRecover },
  { key: "restrained", component: RemoveRestrained },
  { key: "speed", component: RemoveSpeed },
  { key: "duration", component: RemoveDuration },
  { key: "rangeIncrease", component: RemoveRangeIncrease },
  { key: "requiresAmmo", component: RemoveRequiresAmmo },
  { key: "ranged", component: RemoveRanged },
  { key: "upcast", component: RemoveUpcast },
  { key: "disadvantage", component: RemoveDisadvantage },
  { key: "cost", component: RemoveCost },
  { key: "castTime", component: RemoveCastTime },
  { key: "specific", component: RemoveSpecific },
  { key: "consumable", component: RemoveConsumable },
  { key: "onFailTakeDamage", component: RemoveOnFailTakeDamage },
  { key: "curse", component: RemoveCurse },
  { key: "tierDecrease", component: RemoveTierDecrease },
  { key: "tierIncrease", component: RemoveTierIncrease },
  { key: "meleeAndRanged", component: RemoveMeleeAndRangedAttribute },
  { key: "onSuccess", component: RemoveOnSuccess },
  { key: "onAutoSuccess", component: RemoveOnAutoSuccess },
  { key: "prefix", component: RemovePrefix },
  { key: "suffix", component: RemoveSuffix },
  { key: "flavor", component: RemoveFlavor },
];
