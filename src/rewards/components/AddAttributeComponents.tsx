import AddStunned from "./attributes/AddStunned";
import AddNoAction from "./attributes/AddNoAction";
import AddSummon from "./attributes/AddSummon";
import AddNoCheck from "./attributes/AddNoCheck";
import AddRelentless from "./attributes/AddRelentless";
import AddAoe from "./attributes/AddAoE";
import AddAvoidAllies from "./attributes/AddAvoidAllies";
import AddLingeringDamage from "./attributes/AddLingeringDamage";
import AddTeleport from "./attributes/AddTeleport";
import AddSummonTierIncrease from "./attributes/AddSummonTierIncrease";
import AddDeals from "./attributes/AddDeals";
import AddHeals from "./attributes/AddHeals";
import AddReduceDamage from "./attributes/AddReduceDamage";
import AddGrantsAbilities from "./attributes/AddGrantsAbilities";
import AddWellspringMax from "./attributes/AddWellspringMax";
import AddWellspringRecover from "./attributes/AddWellspringRecover";
import AddRestrained from "./attributes/AddRestrained";
import AddSpeed from "./attributes/AddSpeed";
import AddNoChase from "./attributes/AddNoChase";
import AddDuration from "./attributes/AddDuration";
import AddAdvantage from "./attributes/AddAdvantage";
import AddWhileDefending from "./attributes/AddWhileDefending";
import AddRangeIncrease from "./attributes/AddRangeIncrease";
import AddRequiresAmmo from "./attributes/AddRequiresAmmo";
import AddIsMove from "./attributes/AddIsMove";
import AddRanged from "./attributes/AddRanged";
import AddTrained from "./attributes/AddTrained";
import AddUpcast from "./attributes/AddUpcast";
import AddDisadvantage from "./attributes/AddDisadvantage";
import AddCost from "./attributes/AddCost";
import AddCastTime from "./attributes/AddCastTime";
import AddSpecific from "./attributes/AddSpecific";
import AddConsumable from "./attributes/AddConsumable";
import AddOnFailTakeDamage from "./attributes/AddOnFailTakeDamage";

export const attributeComponents: readonly {
  key: string;
  component: React.FC<any>;
}[] = [
  { key: "stunned", component: AddStunned },
  { key: "noAction", component: AddNoAction },
  { key: "summon", component: AddSummon },
  { key: "noCheck", component: AddNoCheck },
  { key: "relentless", component: AddRelentless },
  { key: "aoe", component: AddAoe },
  { key: "avoidAllies", component: AddAvoidAllies },
  { key: "lingeringDamage", component: AddLingeringDamage },
  { key: "teleport", component: AddTeleport },
  { key: "summonTierIncrease", component: AddSummonTierIncrease },
  { key: "deals", component: AddDeals },
  { key: "heals", component: AddHeals },
  { key: "reduceDamage", component: AddReduceDamage },
  { key: "grantsAbilities", component: AddGrantsAbilities },
  { key: "wellspringMax", component: AddWellspringMax },
  { key: "wellspringRecover", component: AddWellspringRecover },
  { key: "restrained", component: AddRestrained },
  { key: "speed", component: AddSpeed },
  { key: "noChase", component: AddNoChase },
  { key: "duration", component: AddDuration },
  { key: "advantage", component: AddAdvantage },
  { key: "whileDefending", component: AddWhileDefending },
  { key: "rangeIncrease", component: AddRangeIncrease },
  { key: "requiresAmmo", component: AddRequiresAmmo },
  { key: "isMove", component: AddIsMove },
  { key: "ranged", component: AddRanged },
  { key: "trained", component: AddTrained },
  { key: "upcast", component: AddUpcast },
  { key: "disadvantage", component: AddDisadvantage },
  { key: "cost", component: AddCost },
  { key: "castTime", component: AddCastTime },
  { key: "specific", component: AddSpecific },
  { key: "consumable", component: AddConsumable },
  { key: "onFailTakeDamage", component: AddOnFailTakeDamage },
] as const;
