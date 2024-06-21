import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { ShopProvider, useShopContext } from "../contexts/ShopContext";
import ShopCategoriesEdit from "./EditShopCategories";
import { Link } from "react-router-dom";

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
      <Row className={"mb-5"}>
        {shops.map((shop) => (
          <Col sm="6" md="4" lg="3" xl="2" key={shop.id}>
            <Link
              to={`/shop/${shop.id}/edit`}
              style={{ textDecoration: "none" }}
            >
              <Card>
                <Card.Img
                  variant="top"
                  src={shop.image || shop.proprietorImage}
                />
                <Card.Body>
                  <Card.Title>{shop.name}</Card.Title>
                  {shop.proprietor && (
                    <Card.Subtitle className="mb-2 text-muted">
                      Proprietor: {shop.proprietor}
                    </Card.Subtitle>
                  )}
                  <Card.Text>{shop.description}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
        <Col sm="6" md="4" lg="3" xl="2">
          <Card key="add" className={`ph-0`}>
            <Card.Img variant="top" src="https://placehold.co/400x400" />
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
