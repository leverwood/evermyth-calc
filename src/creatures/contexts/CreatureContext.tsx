import React, { createContext, useContext, useState } from "react";
import {
  Creature,
  isCreature,
  isLegendary,
  LegendaryCreature,
} from "../types/creature-types";
import { migrateCreature } from "../util/creature-calcs";
import { CURRENT_VERSION } from "../../util/constants";

interface CreatureContextProps {
  creatures: (Creature | LegendaryCreature)[];
  addCreature: (creature: Omit<Creature | LegendaryCreature, "id">) => string;
  updateCreature: (creature: Creature | LegendaryCreature) => void;
  deleteCreature: (id: string) => void;
  getCreatureById: (id: string) => Creature | LegendaryCreature | undefined;
}

const CreatureContext = createContext<CreatureContextProps | undefined>(
  undefined
);

export const useCreatureContext = () => {
  const context = useContext(CreatureContext);
  if (!context) {
    throw new Error(
      "useCreatureContext must be used within a CreatureProvider"
    );
  }
  return context;
};

const CREATURES_STORAGE_KEY = "creatures";

export const CreatureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [creatures, setCreatures] = useState<(Creature | LegendaryCreature)[]>(
    () => {
      const storedCreatures = localStorage.getItem(CREATURES_STORAGE_KEY);
      const creatures = storedCreatures ? JSON.parse(storedCreatures) : [];
      const newCreatures = creatures.map(migrateCreature) as (
        | Creature
        | LegendaryCreature
      )[];

      localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
      return newCreatures;
    }
  );

  const addCreature = (
    creature: Omit<Creature | LegendaryCreature, "id">
  ): string => {
    const id = crypto.randomUUID();

    let newCreature: Creature | LegendaryCreature;

    if (isLegendary(creature)) {
      newCreature = {
        ...creature,
        legendary: true,
        id,
        version: CURRENT_VERSION,
        created: new Date().toISOString(),
        statblocks: [...creature.statblocks],
      };
    } else if (isCreature(creature)) {
      newCreature = {
        ...creature,
        legendary: false,
        id,
        version: CURRENT_VERSION,
        created: new Date().toISOString(),
        tier: creature.tier || 1,
        rewards: creature.rewards || [],
      };
    }

    setCreatures((prevCreatures) => {
      const newCreatures = [...prevCreatures, newCreature];
      localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
      console.log(`adding creature: ${JSON.stringify(newCreature)}`);
      return newCreatures;
    });
    return id;
  };

  const updateCreature = (updatedCreature: Creature | LegendaryCreature) => {
    if (isLegendary(updatedCreature)) {
      updatedCreature = {
        ...updatedCreature,
        statblocks: [...(updatedCreature.statblocks || [])],
      };
    }

    setCreatures((prevCreatures) => {
      const newCreatures = prevCreatures.map((creature) =>
        creature.id === updatedCreature.id ? updatedCreature : creature
      );
      localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
      return newCreatures;
    });
  };

  const deleteCreature = (id: string) => {
    setCreatures((prevCreatures) => {
      const newCreatures = prevCreatures.filter(
        (creature) => creature.id !== id
      );
      localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
      console.log(`deleting creature: ${id}`);
      return newCreatures;
    });
  };

  const getCreatureById = (id: string) => {
    return creatures.find((creature) => creature.id === id);
  };

  return (
    <CreatureContext.Provider
      value={{
        creatures,
        addCreature,
        updateCreature,
        deleteCreature,
        getCreatureById,
      }}
    >
      {children}
    </CreatureContext.Provider>
  );
};
