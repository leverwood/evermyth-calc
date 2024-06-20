import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { useShopContext } from "../contexts/ShopContext";
import ShopCategoryCheckboxes from "./ShopCategoryCheckboxes";
import { useEffect, useState } from "react";
import { ShopCategory } from "../types/shop-types";
import Price from "./Price";
import { Link } from "react-router-dom";
import { RewardData } from "../../rewards/types/reward-types";
import { Service } from "../../services/types/service-types";

interface Item {
  type: "reward" | "service";
  data: RewardData | Service;
}

function BrowseAllItems({
  tier = 1,
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
  const { rewards, services } = useShopContext();
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<
    ShopCategory["slug"][]
  >([]);
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
        if (filteredCategories.length === 0) {
          return true;
        }
        return filteredCategories.some((slug) =>
          item.data.shopCategories?.includes(slug)
        );
      })
      .sort((a, b) => {
        return (a.data.price || 0) - (b.data.price || 0);
      })
      .sort((a, b) => {
        return (a.data.name || "").localeCompare(b.data.name || "");
      });
    setFilteredItems(items);
  }, [alreadyAddedIds, filteredCategories, rewards, services]);

  return (
    <>
      <Row>
        <Col sm="4" md="3">
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
                    <strong>
                      <Link to={`/${item.type}/${item.data.id}/edit`}>
                        {item.data.name}
                      </Link>
                    </strong>{" "}
                    <Price cp={item.data.price} tier={tier} />
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
