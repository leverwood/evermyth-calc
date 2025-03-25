import AddStunned from "./attributes/AddStunned";
import AddSummon from "./attributes/AddSummon";
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
import AddRangeIncrease from "./attributes/AddRangeIncrease";
import AddRequiresAmmo from "./attributes/AddRequiresAmmo";
import AddRanged from "./attributes/AddRanged";
import AddTrained from "./attributes/AddTrained";
import AddUpcast from "./attributes/AddUpcast";
import AddDisadvantage from "./attributes/AddDisadvantage";
import AddCost from "./attributes/AddCost";
import AddCastTime from "./attributes/AddCastTime";
import AddSpecific from "./attributes/AddSpecific";
import AddConsumable from "./attributes/AddConsumable";
import AddOnFailTakeDamage from "./attributes/AddOnFailTakeDamage";
import AddResistantAttribute from "./attributes/AddResistant";
import AddVulnerableAttribute from "./attributes/AddVulnerable";
import AddImposeVulnerableAttribute from "./attributes/AddImposeVulnerable";
import AddImmuneAttribute from "./attributes/AddImmune";
import { RewardData } from "../types/reward-types";
import AddCurse from "./attributes/AddCurse";
import AddTierDecrease from "./attributes/AddTierDecrease";
import AddTierIncrease from "./attributes/AddTierIncrease";
import AddMeleeAndRangedAttribute from "./attributes/AddMeleeAndRanged";
import AddOnSuccessAttribute from "./attributes/AddOnSuccess";
import AddOnAutoSuccessAttribute from "./attributes/AddOnAutoSuccess";
import AddPrefix from "./attributes/AddPrefix";
import AddSuffix from "./attributes/AddSuffix";
import AddFlavor from "./attributes/AddFlavor";
import AddAoeSizeIncrease from "./attributes/AddAoeSizeIncrease";
import AddRangeDecrease from "./attributes/AddRangeDecrease";

export const attributeComponents: readonly {
  key: keyof RewardData;
  component: React.FC<any>;
}[] = [
  { key: "stunned", component: AddStunned },
  { key: "summon", component: AddSummon },
  { key: "relentless", component: AddRelentless },
  { key: "aoe", component: AddAoe },
  { key: "aoeSizeIncrease", component: AddAoeSizeIncrease },
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
  { key: "rangeIncrease", component: AddRangeIncrease },
  { key: "rangeDecrease", component: AddRangeDecrease },
  { key: "requiresAmmo", component: AddRequiresAmmo },
  { key: "ranged", component: AddRanged },
  { key: "trained", component: AddTrained },
  { key: "upcast", component: AddUpcast },
  { key: "disadvantage", component: AddDisadvantage },
  { key: "cost", component: AddCost },
  { key: "castTime", component: AddCastTime },
  { key: "specific", component: AddSpecific },
  { key: "consumable", component: AddConsumable },
  { key: "onFailTakeDamage", component: AddOnFailTakeDamage },
  { key: "resistant", component: AddResistantAttribute },
  { key: "vulnerable", component: AddVulnerableAttribute },
  { key: "imposeVulnerable", component: AddImposeVulnerableAttribute },
  { key: "immune", component: AddImmuneAttribute },
  { key: "curse", component: AddCurse },
  { key: "tierDecrease", component: AddTierDecrease },
  { key: "tierIncrease", component: AddTierIncrease },
  { key: "meleeAndRanged", component: AddMeleeAndRangedAttribute },
  { key: "onSuccess", component: AddOnSuccessAttribute },
  { key: "onAutoSuccess", component: AddOnAutoSuccessAttribute },
  { key: "prefix", component: AddPrefix },
  { key: "suffix", component: AddSuffix },
  { key: "flavor", component: AddFlavor },
] as const;
