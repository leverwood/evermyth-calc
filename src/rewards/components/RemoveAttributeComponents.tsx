import RemoveStunned from "./attributes/RemoveStunned";
import RemoveNoAction from "./attributes/RemoveNoAction";
import RemoveSummon from "./attributes/RemoveSummon";
import RemoveNoCheck from "./attributes/RemoveNoCheck";
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
import RemoveNoChase from "./attributes/RemoveNoChase";
import RemoveDuration from "./attributes/RemoveDuration";
import RemoveAdvantage from "./attributes/RemoveAdvantage";
import RemoveWhileDefending from "./attributes/RemoveWhileDefending";
import RemoveRangeIncrease from "./attributes/RemoveRangeIncrease";
import RemoveRequiresAmmo from "./attributes/RemoveRequiresAmmo";
import RemoveIsMove from "./attributes/RemoveIsMove";
import RemoveRanged from "./attributes/RemoveRanged";
import RemoveTrained from "./attributes/RemoveTrained";
import RemoveUpcast from "./attributes/RemoveUpcast";
import RemoveDisadvantage from "./attributes/RemoveDisadvantage";
import RemoveCost from "./attributes/RemoveCost";
import RemoveCastTime from "./attributes/RemoveCastTime";
import RemoveSpecific from "./attributes/RemoveSpecific";
import RemoveConsumable from "./attributes/RemoveConsumable";
import RemoveOnFailTakeDamage from "./attributes/RemoveOnFailTakeDamage";

export const attributeComponents = [
  { key: "stunned", component: RemoveStunned },
  { key: "noAction", component: RemoveNoAction },
  { key: "summon", component: RemoveSummon },
  { key: "noCheck", component: RemoveNoCheck },
  { key: "relentless", component: RemoveRelentless },
  { key: "aoe", component: RemoveAoe },
  { key: "avoidAllies", component: RemoveAvoidAllies },
  { key: "lingeringDamage", component: RemoveLingeringDamage },
  { key: "teleport", component: RemoveTeleport },
  { key: "summonTierIncrease", component: RemoveSummonTierIncrease },
  { key: "deals", component: RemoveDeals },
  { key: "heals", component: RemoveHeals },
  { key: "reduceDamage", component: RemoveReduceDamage },
  { key: "grantsAbilities", component: RemoveGrantsAbilities },
  { key: "wellspringMax", component: RemoveWellspringMax },
  { key: "wellspringRecover", component: RemoveWellspringRecover },
  { key: "restrained", component: RemoveRestrained },
  { key: "speed", component: RemoveSpeed },
  { key: "noChase", component: RemoveNoChase },
  { key: "duration", component: RemoveDuration },
  { key: "advantage", component: RemoveAdvantage },
  { key: "whileDefending", component: RemoveWhileDefending },
  { key: "rangeIncrease", component: RemoveRangeIncrease },
  { key: "requiresAmmo", component: RemoveRequiresAmmo },
  { key: "isMove", component: RemoveIsMove },
  { key: "ranged", component: RemoveRanged },
  { key: "trained", component: RemoveTrained },
  { key: "upcast", component: RemoveUpcast },
  { key: "disadvantage", component: RemoveDisadvantage },
  { key: "cost", component: RemoveCost },
  { key: "castTime", component: RemoveCastTime },
  { key: "specific", component: RemoveSpecific },
  { key: "consumable", component: RemoveConsumable },
  { key: "onFailTakeDamage", component: RemoveOnFailTakeDamage },
];
