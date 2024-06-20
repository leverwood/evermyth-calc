import React, { createContext, useContext, useState } from "react";
import { Shop, ShopCategory } from "../types/shop-types";
import { RewardData } from "../../rewards/types/reward-types";
import { Service } from "../../services/types/service-types";

interface ShopContextProps {
  shops: Shop[];
  addShop: (shop: Omit<Shop, "id">) => string;
  updateShop: (shop: Shop) => void;
  deleteShop: (id: string) => void;
  getShopById: (id: string) => Shop | undefined;
  shopCategories: ShopCategory[];
  addShopCategory: (category: ShopCategory) => void;
  updateShopCategory: (category: ShopCategory) => void;
  deleteShopCategory: (slug: string) => void;
  getShopCategoryBySlug: (slug: string) => ShopCategory | undefined;
  rewards: RewardData[];
  services: Service[];
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
const SHOP_CATEGORY_STORAGE_KEY = "shop_categories";
const REWARDS_STORAGE_KEY = "rewards";
const SERVICES_STORAGE_KEY = "services";

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [shops, setShops] = useState<Shop[]>(() => {
    const storedShops = localStorage.getItem(SHOP_STORAGE_KEY);
    return storedShops ? JSON.parse(storedShops) : [];
  });
  const [shopCategories, setShopCategories] = useState<ShopCategory[]>(() => {
    const storedShopCategories = localStorage.getItem(
      SHOP_CATEGORY_STORAGE_KEY
    );
    return storedShopCategories ? JSON.parse(storedShopCategories) : [];
  });

  const [rewards] = useState<RewardData[]>(() => {
    const storedRewards = localStorage.getItem(REWARDS_STORAGE_KEY);
    const allRewards = storedRewards ? JSON.parse(storedRewards) : [];
    return allRewards.filter((reward: RewardData) => reward.price);
  });

  const [services] = useState<Service[]>(() => {
    const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
    return storedServices ? JSON.parse(storedServices) : [];
  });

  const addShop = (shop: Omit<Shop, "id">): string => {
    const newShop: Shop = { ...shop, id: crypto.randomUUID() };
    setShops((prevShops) => {
      const newShops = [...prevShops, newShop];
      localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(newShops));
      return newShops;
    });
    return newShop.id;
  };

  const updateShop = (updatedShop: Shop) => {
    setShops((prevShops) => {
      const newShops = prevShops.map((shop) =>
        shop.id === updatedShop.id ? updatedShop : shop
      );
      localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(newShops));
      return newShops;
    });
  };

  const deleteShop = (id: string) => {
    setShops((prevShops) => {
      const newShops = prevShops.filter((shop) => shop.id !== id);
      localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(newShops));
      return newShops;
    });
  };

  const getShopById = (id: string) => {
    return shops.find((shop) => shop.id === id);
  };

  const addShopCategory = (category: ShopCategory) => {
    setShopCategories((prevCategories) => {
      const newCategories = [...prevCategories, category];
      localStorage.setItem(
        SHOP_CATEGORY_STORAGE_KEY,
        JSON.stringify(newCategories)
      );
      return newCategories;
    });
  };

  const updateShopCategory = (updatedCategory: ShopCategory) => {
    setShopCategories((prevCategories) => {
      const newCategories = prevCategories.map((category) =>
        category.slug === updatedCategory.slug ? updatedCategory : category
      );
      localStorage.setItem(
        SHOP_CATEGORY_STORAGE_KEY,
        JSON.stringify(newCategories)
      );
      return newCategories;
    });
  };

  const deleteShopCategory = (slug: string) => {
    setShopCategories((prevCategories) => {
      const newCategories = prevCategories.filter(
        (category) => category.slug !== slug
      );
      console.log("Filtered", newCategories);
      localStorage.setItem(
        SHOP_CATEGORY_STORAGE_KEY,
        JSON.stringify(newCategories)
      );
      return newCategories;
    });
  };

  const getShopCategoryBySlug = (slug: string) => {
    return shopCategories.find((category) => category.slug === slug);
  };

  return (
    <ShopContext.Provider
      value={{
        shops,
        addShop,
        updateShop,
        deleteShop,
        getShopById,
        shopCategories,
        addShopCategory,
        updateShopCategory,
        deleteShopCategory,
        getShopCategoryBySlug,
        rewards,
        services,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
