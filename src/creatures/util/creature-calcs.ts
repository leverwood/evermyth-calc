import { Creature } from "../types/creature-types";

export function migrateCreature(creature: any): Creature {
  const newData: Creature = {
    ...creature,
  };
  return newData as Creature;
}