import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useShopContext } from "../contexts/ShopContext";
import { Shop } from "../types/shop-types";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";
import ViewService from "../../services/components/ViewService";
import { Service } from "../../services/types/service-types";
import { isRewardData, RewardData } from "../../rewards/types/reward-types";

const ViewShop: React.FC = () => {
  const { getShopById, rewards, services } =
    useShopContext();
  const { id } = useParams<{ id?: string }>();
  const [shopData, setShopData] = useState<Shop>({
    id: "",
    name: "",
    image: "",
    proprietor: "",
    proprietorImage: "",
    description: "",
    discount: 0,
    forSale: [],
    tier: 1,
    shopType: "",
  });
  const [sortedForSale, setSortedForSale] =
    useState<(RewardData | Service)[]>();

  // set shop data if id changes
  useEffect(() => {
    if (id && shopData.id !== id) {
      console.log(`getShopById(${id})`);
      const shop = getShopById(id);
      if (shop) {
        setShopData(shop);
      }
    }
  }, [id, getShopById, shopData.id]);

  useEffect(() => {
    const data: (RewardData | Service)[] = shopData.forSale
      ?.map((item) => {
        const dataItem =
          item.type === "reward"
            ? rewards.find((r) => r.id === item.id)
            : services.find((s) => s.id === item.id);
        if (!dataItem) return null;
        return dataItem;
      })
      .filter((item) => item !== null) as (RewardData | Service)[];
    const sortedItems: (RewardData | Service)[] = data.sort((a, b) => {
      if (!a || !b) return 0;
      return a?.name?.localeCompare(b?.name || "") || 0;
    });
    setSortedForSale(sortedItems);
  }, [shopData.forSale, rewards, services]);

  return (
    <div style={{ width: "100%", maxWidth: 800 }}>
      <h1>{id ? shopData.name : "View Shop"}</h1>
      {sortedForSale && sortedForSale.length > 0 && (
        <ul>
          {sortedForSale.map((item) => {
            if (isRewardData(item)) {
              return (
                <li key={item.id}>
                  <SingleRewardText
                    reward={initReward(item)}
                    className="reward-text"
                    showPrice={true}
                    noTier={true}
                    typeBefore={true}
                    noType={true}
                    oneLine={true}
                  />
                </li>
              );
            } else {
              return (
                <li key={item.id}>
                  <ViewService service={item} />
                </li>
              );
            }
          })}
        </ul>)}
    </div>
  );
};

export default ViewShop;
