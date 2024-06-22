import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { ShopProvider, useShopContext } from "../contexts/ShopContext";
import ShopCategoriesEdit from "./EditShopCategories";
import { Link } from "react-router-dom";
import SquareImage from "../../components/SquareImage";
import DynamicText from "../../components/DynamicText";

interface ShopListProps {}

const ShopListPage: React.FC<ShopListProps> = () => {
  return (
    <ShopProvider>
      <ShopList />
    </ShopProvider>
  );
};

function ShopList() {
  const { shops } = useShopContext();
  return (
    <Container>
      <Row className={"mb-5"} style={{ alignItems: "stretch" }}>
        {shops
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((shop) => (
            <Col className={`mb-4`} sm="6" md="4" lg="3" key={shop.id}>
              <Link
                to={`/shop/${shop.id}/edit`}
                style={{ textDecoration: "none" }}
              >
                <Card style={{ height: "100%" }}>
                  <SquareImage url={shop.image || shop.proprietorImage} />
                  <Card.Body>
                    <Card.Title>
                      {" "}
                      <DynamicText height={25}>{shop.name}</DynamicText>
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        <Col className={`mb-4`} sm="6" md="4" lg="3">
          <Card key="add" className={`ph-0`} style={{ height: "100%" }}>
            <SquareImage url="" />
            <Card.Body>
              <a href="/shop/add">
                <Button variant="primary">Add Shop</Button>
              </a>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <ShopCategoriesEdit />
      </Row>
    </Container>
  );
}

export default ShopListPage;
