import { Button, Col, InputGroup, ListGroup, Row, Form } from "react-bootstrap";
import { useEffect, useState } from "react";

import { useShopContext } from "../contexts/ShopContext";
import ShopCategoryCheckboxes from "./ShopCategoryCheckboxes";
import { ShopCategory } from "../types/shop-types";
import Price from "./Price";
import { isReward, RewardData } from "../../rewards/types/reward-types";
import { Service } from "../../services/types/service-types";
import TooltipSlider from "../../components/TooltipSlider";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";
import WrappingLink from "../../components/WrappingLink";

interface Item {
  type: "reward" | "service";
  data: RewardData | Service;
}

const findMaxPrice = (items: (RewardData | Service)[]) => {
  let max = 0;
  items.forEach((item) => {
    const price = item.price || 0;
    if (price > max) max = price;
  });
  return max;
};

function BrowseAllItems({
  tier = 99999,
  handleAddForSale,
  alreadyAddedIds,
}: {
  tier?: number;
  handleAddForSale: (
    type: "reward" | "service",
    item: RewardData | Service
  ) => void;
  alreadyAddedIds: string[];
}) {
  const [searchText, setSearchText] = useState<string>("");
  const { rewards, services } = useShopContext();
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    ShopCategory["slug"][]
  >([]);
  const [maxPrice, setMaxPrice] = useState<number>(
    findMaxPrice([...rewards, ...services])
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    findMaxPrice([...rewards, ...services]),
  ]);

  // filter the items
  useEffect(() => {
    let items: Item[] = [];
    rewards.forEach((reward) => {
      items.push({
        type: "reward",
        data: reward,
      });
    });
    services.forEach((service) => {
      items.push({
        type: "service",
        data: service,
      });
    });
    items = items
      .filter((item) => !alreadyAddedIds.includes(item.data.id || ""))
      .filter((item) => {
        if (!searchText) {
          return true;
        }
        return (item.data.name || "")
          .toLowerCase()
          .includes(searchText.toLowerCase());
      })
      .filter((item) => {
        if (filteredCategories.length === 0) {
          return true;
        }
        return filteredCategories.some((slug) =>
          item.data.shopCategories?.includes(slug)
        );
      })
      .filter((item) => {
        const reward = initReward(item.data);
        return !isReward(reward) || reward.tier < tier;
      })
      .sort((a, b) => {
        return (a.data.price || 0) - (b.data.price || 0);
      })
      .sort((a, b) => {
        return (a.data.name || "").localeCompare(b.data.name || "");
      });
    setFilteredItems(items);
  }, [
    alreadyAddedIds,
    filteredCategories,
    priceRange,
    rewards,
    searchText,
    services,
    tier,
  ]);

  // update the max price when the items are filtered
  useEffect(() => {
    const unfolded = filteredItems.map((item) => item.data);
    const newMaxPrice = findMaxPrice(unfolded);

    // if it's already the max amount
    if (priceRange[1] === maxPrice) {
      priceRange[1] = newMaxPrice;
    }
    // if it's bigger than the max amount
    if (priceRange[1] > newMaxPrice) {
      setPriceRange([priceRange[0], newMaxPrice]);
    }
    setMaxPrice(newMaxPrice);
  }, [filteredItems, maxPrice, priceRange]);

  return (
    <>
      <Row className="mb-3">
        <InputGroup className="mb-1">
          <Form.Control
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search"
          ></Form.Control>
          <InputGroup.Text>🔎</InputGroup.Text>
        </InputGroup>
      </Row>
      <Row>
        <Col sm="4" md="3">
          <div className="mb-3">
            <p>
              <strong>Price Range</strong>
              <br />
              {priceRange[0]}cp - {priceRange[1]}cp
            </p>
            <TooltipSlider
              range
              min={0}
              max={maxPrice}
              defaultValue={[0, maxPrice]}
              onChangeComplete={(value) =>
                setPriceRange(value as [number, number])
              }
              step={10}
            />
          </div>
          <ShopCategoryCheckboxes
            checkedCategories={filteredCategories}
            setChecked={setFilteredCategories}
          />
        </Col>
        <Col sm="8" md="9">
          <ListGroup>
            {filteredItems.map((item) => (
              <ListGroup.Item key={item.data.id}>
                <Row>
                  <Col>
                    <WrappingLink to={`/${item.type}s/${item.data.id}/edit`}>
                      {item.type === "reward" ? (
                        <SingleRewardText
                          reward={initReward(item.data)}
                          oneLine={true}
                          noType={true}
                          showPrice={true}
                        />
                      ) : (
                        <p>
                          <strong>
                            <em>{item.data.name}.</em>
                          </strong>{" "}
                          {(item.data as Service).description}
                          <Price cp={item.data.price} />
                        </p>
                      )}
                    </WrappingLink>
                  </Col>
                  <Col sm="2" style={{ textAlign: "right" }}>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleAddForSale(item.type, item.data)}
                    >
                      ➕
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default BrowseAllItems;
