import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { useShopContext } from "../contexts/ShopContext";
import FilterByShopCategories from "./FilterByShopCategories";
import { useEffect, useState } from "react";
import { ShopCategory } from "../types/shop-types";

function BrowseAllItems() {
  const { rewards, services } = useShopContext();
  const [filteredItems, setFilteredItems] = useState([...rewards, ...services]);
  const [filteredCategories, setFilteredCategories] = useState<ShopCategory[]>(
    []
  );

  useEffect(() => {
    let items = [...rewards, ...services];
    items = items
      .filter((item) => {
        if (filteredCategories.length === 0) {
          return true;
        }
        return filteredCategories.some((category) =>
          item.shopCategories?.includes(category.slug)
        );
      })
      .sort((a, b) => {
        return (a.name || "").localeCompare(b.name || "");
      })
      .sort((a, b) => {
        return (a.price || 0) - (b.price || 0);
      });
    setFilteredItems(items);
  }, [filteredCategories, rewards, services]);

  return (
    <Container>
      <Row>
        <Col sm="4">
          <FilterByShopCategories
            filteredCategories={filteredCategories}
            setFilteredCategories={setFilteredCategories}
          />
        </Col>
        <Col sm="8">
          <ListGroup>
            {filteredItems.map((item) => (
              <ListGroup.Item key={item.id}>
                <strong>{item.name}</strong>
                <p>${item.price}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
}

export default BrowseAllItems;
