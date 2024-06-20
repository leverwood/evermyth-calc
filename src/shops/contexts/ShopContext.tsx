import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Shop } from "../types/shop-types";
import { RewardData } from "../../rewards/types/reward-types";

interface ShopContextProps {
  shops: Shop[];
  addShop: (shop: Omit<Shop, "id">) => string;
  updateShop: (shop: Shop) => void;
  deleteShop: (id: string) => void;
  getShopById: (id: string) => Shop | undefined;
  rewards: RewardData[];
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopProvider");
  }
  return context;
};

const SHOP_STORAGE_KEY = "shops";
const SHOP_BACKUP_KEY = "shops_backup";
const REWARDS_STORAGE_KEY = "rewards";

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [shops, setShops] = useState<Shop[]>(() => {
    const storedShops = localStorage.getItem(SHOP_STORAGE_KEY);
    return storedShops ? JSON.parse(storedShops) : [];
  });

  const [rewards, setRewards] = useState<RewardData[]>(() => {
    const storedRewards = localStorage.getItem(REWARDS_STORAGE_KEY);
    const allRewards = storedRewards ? JSON.parse(storedRewards) : [];
    return allRewards.filter((reward: RewardData) => reward.price);
  });

  const handleWindowUnload = useCallback(() => {
    localStorage.setItem(SHOP_BACKUP_KEY, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(shops));
  }, [shops]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowUnload);
    return () => {
      window.removeEventListener("beforeunload", handleWindowUnload);
    };
  }, [handleWindowUnload, shops]);

  const addShop = (shop: Omit<Shop, "id">): string => {
    const newShop: Shop = { ...shop, id: crypto.randomUUID() };
    setShops((prevShops) => [...prevShops, newShop]);
    return newShop.id;
  };

  const updateShop = (updatedShop: Shop) => {
    setShops((prevShops) =>
      prevShops.map((shop) => (shop.id === updatedShop.id ? updatedShop : shop))
    );
  };

  const deleteShop = (id: string) => {
    setShops((prevShops) => prevShops.filter((shop) => shop.id !== id));
  };

  const getShopById = (id: string) => {
    return shops.find((shop) => shop.id === id);
  };

  return (
    <ShopContext.Provider
      value={{ shops, addShop, updateShop, deleteShop, getShopById, rewards }}
    >
      {children}
    </ShopContext.Provider>
  );
};
