import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useShopContext } from "../contexts/ShopContext";
import { Link } from "react-router-dom";

function ShopCategoriesEdit() {
  const { shopCategories } = useShopContext();
  return (
    <Container>
      <Row>
        <Col>
          <h1 className={"mb-3"}>Edit Shop Categories</h1>
          <ListGroup className={"mb-3"}>
            {shopCategories &&
              shopCategories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <ListGroup.Item key={category.slug}>
                    <Link to={`/shop-categories/${category.slug}/edit`}>
                      {category.name}
                    </Link>
                  </ListGroup.Item>
                ))}
          </ListGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Link to="/shop-categories/add">
            <Button>Add Shop Category</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default ShopCategoriesEdit;
