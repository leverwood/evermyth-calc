import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { RewardData } from "../types/reward-types";

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
const REWARDS_BACKUP_KEY = "rewards_backup";

export const RewardProvider = ({ children }: { children: React.ReactNode }) => {
  const [rewards, setRewards] = useState<RewardData[]>(() => {
    const storedRewards = localStorage.getItem(REWARDS_STORAGE_KEY);
    return storedRewards ? JSON.parse(storedRewards) : [];
  });

  const handleWindowUnload = useCallback(() => {
    localStorage.setItem(
      REWARDS_BACKUP_KEY + new Date(),
      JSON.stringify(rewards)
    );
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowUnload);
    return () => {
      window.removeEventListener("beforeunload", handleWindowUnload);
    };
  }, [handleWindowUnload, rewards]);

  const addReward = (reward: Omit<RewardData, "id">): string => {
    const id = crypto.randomUUID();
    const newReward: RewardData = { ...reward, id };
    setRewards((prevRewards) => [...prevRewards, newReward]);
    return id;
  };

  const updateReward = (updatedReward: RewardData) => {
    setRewards((prevRewards) =>
      prevRewards.map((reward) =>
        reward.id === updatedReward.id ? updatedReward : reward
      )
    );
  };

  const deleteReward = (id: string) => {
    setRewards((prevRewards) =>
      prevRewards.filter((reward) => reward.id !== id)
    );
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
