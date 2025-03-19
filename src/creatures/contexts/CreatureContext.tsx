import React, { createContext, useContext, useState } from "react";
import { Creature } from "../types/creature-types";
import { migrateCreature } from "../util/creature-calcs";
import { CURRENT_VERSION } from "../../util/constants";

interface CreatureContextProps {
  creatures: Creature[];
  addCreature: (creature: Omit<Creature, "id">) => string;
  updateCreature: (creature: Creature) => void;
  deleteCreature: (id: string) => void;
  getCreatureById: (id: string) => Creature | undefined;
}

const CreatureContext = createContext<CreatureContextProps | undefined>(undefined);

export const useCreatureContext = () => {
  const context = useContext(CreatureContext);
  if (!context) {
    throw new Error("useCreatureContext must be used within a CreatureProvider");
  }
  return context;
};

const CREATURES_STORAGE_KEY = "creatures";

export const CreatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [creatures, setCreatures] = useState<Creature[]>(() => {
    const storedCreatures = localStorage.getItem(CREATURES_STORAGE_KEY);
    const creatures = storedCreatures ? JSON.parse(storedCreatures) : [];
    const newCreatures = creatures.map(migrateCreature) as Creature[];

    localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
    return newCreatures;
  });

  const addCreature = (creature: Omit<Creature, "id">): string => {
    const id = crypto.randomUUID();
    const newCreature: Creature = {
      ...creature,
      id,
      version: CURRENT_VERSION,
      created: new Date().toISOString(),
    };
    setCreatures((prevCreatures) => {
      const newCreatures = [...prevCreatures, newCreature];
      localStorage.setItem(CREATURES_STORAGE_KEY, JSON.stringify(newCreatures));
      console.log(`adding creature: ${JSON.stringify(newCreature)}`);
      return newCreatures;
    });
    return id;
  };

  const updateCreature = (updatedCreature: Creature) => {
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
      const newCreatures = prevCreatures.filter((creature) => creature.id !== id);
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
