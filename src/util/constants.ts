export const ABILITY_MIN_LVL = -3;

export const TIER_0_ENEMY_POOL = 1;

// dnd level 18 fighter with +3 weapon

export interface RewardAttribute {
  id: number;
  tier: number;
  tierMultiplier?: number;
  scales: boolean;
  description: string;
  once: boolean;
  deals: number | "tier";
  mod: number | "tier";
  backfire: number;
  wellspring: boolean;
  consumable: boolean;
  restores: number | "tier";
  checkRequired: boolean;
  rollType: "advantage" | "disadvantage" | false;
  noAction: boolean;
  defense: number | "tier";
  aoe: boolean;
  dealsMultiplier?: number;
}

export const ATTRIBUTES: RewardAttribute[] = [];

export const getAttribute = (id: number) => {
  return ATTRIBUTES.find((a) => a.id === id);
};

function addAttribute({
  tier,
  description,
  scales = false,
  once = false,
  deals = 0,
  mod = 0,
  backfire = 0,
  wellspring = false,
  consumable = false,
  restores = 0,
  checkRequired = true,
  noAction = false,
  rollType = false,
  defense = 0,
  tierMultiplier = 1,
  aoe = false,
  dealsMultiplier = 1,
}: {
  tier: number;
  description: string;
  scales?: boolean;
  once?: boolean;
  deals?: number | "tier";
  mod?: number | "tier";
  backfire?: number;
  wellspring?: boolean;
  consumable?: boolean;
  restores?: number | "tier";
  checkRequired?: boolean;
  noAction?: boolean;
  rollType?: "advantage" | "disadvantage" | false;
  defense?: number | "tier";
  tierMultiplier?: number;
  aoe?: boolean;
  dealsMultiplier?: number;
}) {
  ATTRIBUTES.push({
    id: ATTRIBUTES.length,
    tier,
    scales,
    description,
    once,
    deals,
    mod,
    backfire,
    wellspring,
    consumable,
    restores,
    checkRequired,
    noAction,
    rollType,
    defense,
    tierMultiplier,
    aoe,
    dealsMultiplier,
  });
}

addAttribute({
  tier: 0,
  description: "Deal 1d4 (2) points",
  once: true,
  deals: 2,
});
addAttribute({
  tier: 1,
  description: "Add +1 to checks and points dealt",
  deals: 1,
  mod: 1,
});
addAttribute({
  tier: 5,
  description: "Add +5 to checks and points dealt",
  deals: 5,
  mod: 5,
});
addAttribute({
  tier: 1,
  description: "Add your tier to checks and points dealt",
  deals: "tier",
  mod: "tier",
  scales: true,
  once: true,
});
addAttribute({
  tier: -1,
  description: "Subtract 1 from checks and points dealt",
  deals: -1,
  mod: -1,
});
addAttribute({
  tier: -1,
  description:
    "Backfire: on fail, deal 1 to your pool (can be applied reward tier times)",
  backfire: 1,
});
addAttribute({
  tier: -5,
  description: "Backfire: on fail, deal 5 to your pool",
  backfire: 5,
});
addAttribute({
  tier: -1,
  description: "Costs wellspring equal to the reward's tier",
  wellspring: true,
});
addAttribute({
  tier: -4,
  description: "Is consumable",
  consumable: true,
});

// Tier 0 Potion of Healing:
// Restores 2 points +1
// Consumable -4
// Takes no action +3
addAttribute({
  // must have some tier cost or it will be added arbitrarily to random shit.
  tier: 1,
  description: "Restores 2 points, must also be consumable",
  restores: 2,
  once: true,
  consumable: true,
});
// Tier 1 Healing word:
addAttribute({
  // must have some tier or wellspring cost, or it will be added arbitrarily to random shit.
  tier: 0,
  description: "Restores 2, must cost wellspring",
  restores: 2,
  once: true,
});
addAttribute({
  tier: 1,
  description: "Restores 2 more",
  restores: 2,
});
addAttribute({
  tier: 2,
  description: "Is a safe action (no check required)",
  checkRequired: false,
});

addAttribute({
  tier: 1,
  description: "Advantage on check",
  rollType: "advantage",
  once: true,
});
addAttribute({
  tier: -1,
  description: "Disadvantage on check",
  rollType: "disadvantage",
  once: true,
});
addAttribute({
  tier: 3,
  description: "Takes no action",
  noAction: true,
});
addAttribute({
  tier: 1,
  description: "Add +1 to defense rolls",
  defense: 1,
});
addAttribute({
  tier: -1,
  description: "Subtract -1 from defense rolls",
  defense: -1,
});
addAttribute({
  tier: 1,
  description: "Add your tier to defense rolls",
  defense: "tier",
});
addAttribute({
  tier: -1,
  description: "Takes longer to use",
});
addAttribute({
  tier: 0,
  description: "Takes +10 minutes to use, halves required wellspring cost",
});

// need this one first, only once
addAttribute({
  tier: 1,
  description: "Make AoE: Divide dealt by 2",
  aoe: true,
  once: true,
  dealsMultiplier: 1 / 2,
});
addAttribute({
  tier: 1,
  description: "AoE avoids allies",
});
// Meteor swarm = 30
addAttribute({
  tier: 1,
  description: "Deal half on failure",
});
addAttribute({
  tier: 1,
  description: "Equally as effective in both melee and ranged",
});
addAttribute({
  tier: 1,
  description:
    "Add +1 lingering damage at the end of the target's turn. Action to end the effect.",
});
addAttribute({
  tier: 1,
  description: "Restrain a creature. Action to end restraint.",
});
addAttribute({
  tier: -1,
  description: "More rare, additional constraints.",
});
