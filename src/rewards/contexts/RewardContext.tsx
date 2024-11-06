import React, { createContext, useContext, useState } from "react";
import { RewardData } from "../types/reward-types";
import { migrateRewardData } from "../util/reward-calcs";
import { CURRENT_VERSION } from "../../util/constants";

interface RewardContextProps {
  rewards: RewardData[];
  addReward: (reward: Omit<RewardData, "id">) => string;
  updateReward: (reward: RewardData) => void;
  deleteReward: (id: string) => void;
  getRewardById: (id: string) => RewardData | undefined;
}

const RewardContext = createContext<RewardContextProps | undefined>(undefined);

export const useRewardContext = () => {
  const context = useContext(RewardContext);
  if (!context) {
    throw new Error("useRewardContext must be used within a RewardProvider");
  }
  return context;
};

const REWARDS_STORAGE_KEY = "rewards";

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewards, setRewards] = useState<RewardData[]>(() => {
    const storedRewards = localStorage.getItem(REWARDS_STORAGE_KEY);
    const rewards = storedRewards ? JSON.parse(storedRewards) : [];
    const newRewards = rewards.map(migrateRewardData);
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(newRewards));
    return newRewards;
  });

  const addReward = (reward: Omit<RewardData, "id">): string => {
    const id = crypto.randomUUID();
    const newReward: RewardData = {
      ...reward,
      id,
      version: CURRENT_VERSION,
      created: new Date().toISOString(),
    };
    setRewards((prevRewards) => {
      const newRewards = [...prevRewards, newReward];
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(newRewards));
      console.log(`adding reward: ${JSON.stringify(newReward)}`);
      return newRewards;
    });
    return id;
  };

  const updateReward = (updatedReward: RewardData) => {
    setRewards((prevRewards) => {
      const newRewards = prevRewards.map((reward) =>
        reward.id === updatedReward.id ? updatedReward : reward
      );
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(newRewards));
      return newRewards;
    });
  };

  const deleteReward = (id: string) => {
    setRewards((prevRewards) => {
      const newRewards = prevRewards.filter((reward) => reward.id !== id);
      localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(newRewards));
      console.log(`deleting reward: ${id}`);
      return newRewards;
    });
  };

  const getRewardById = (id: string) => {
    return rewards.find((reward) => reward.id === id);
  };

  return (
    <RewardContext.Provider
      value={{
        rewards,
        addReward,
        updateReward,
        deleteReward,
        getRewardById,
      }}
    >
      {children}
    </RewardContext.Provider>
  );
};
