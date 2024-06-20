import React from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { ShopProvider, useShopContext } from "../contexts/ShopContext";
import ShopCategoriesEdit from "./EditShopCategories";

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
          <Col sm="6" key={shop.id}>
            <Card>
              <Card.Img variant="top" src={shop.image} />
              <Card.Body>
                <Card.Title>{shop.name}</Card.Title>
                {shop.proprietor && (
                  <Card.Subtitle className="mb-2 text-muted">
                    Proprietor: {shop.proprietor}
                  </Card.Subtitle>
                )}
                <a href={`/shop/${shop.id}/edit`}>
                  <Button variant="primary">Edit Shop</Button>
                </a>
                <Card.Text>{shop.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col sm="6">
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
