import {
  Creature,
  isCreature,
  isLegendary,
  LegendaryCreature,
  STATBLOCK_TYPE,
} from "../types/creature-types";

export function migrateCreature(creature: any): Creature {
  const newData: Creature | LegendaryCreature = {
    ...creature,
  };
  if (isLegendary(newData)) {
    newData.statblocks = newData.statblocks || [];
  }
  return newData as Creature;
}

export function getLegendaryTier(
  creature: LegendaryCreature,
  getCreatureById: (id: string) => Creature | LegendaryCreature | undefined
): {
  maxTier: number;
  total: number;
  withoutLair: number;
} {
  const creatures = creature.statblocks.map((sb) => getCreatureById(sb.id)).filter((c) => c && isCreature(c)) as Creature[];

  // Add together total tier of all statblocks
  const total = creatures.reduce((acc, creature) => {
    if (!creature || isLegendary(creature)) return acc;
    return acc + creature.tier;
  }, 0);

  const withoutLair = creature.statblocks
    .filter((statblock) => statblock.type !== STATBLOCK_TYPE.LAIR)
    .reduce((acc, statblock) => {
      const creature = getCreatureById(statblock.id);
      if (!creature || isLegendary(creature)) return acc;
      return acc + creature.tier;
    }, 0);
  const tiers = creatures.map((c) => c?.tier || 0);
  const maxTier = Math.max(...tiers);

  return { total, withoutLair, maxTier };
}
