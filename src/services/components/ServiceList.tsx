import { useState } from "react";
import { useServiceContext } from "../contexts/ServiceContext";
import ViewService from "./ViewService";
import { Col, Row, Form, Button, Container, InputGroup } from "react-bootstrap";
import { Service } from "../types/service-types";
import PriceRangeSlider from "./PriceRangeSlider";
import { useNavigate } from "react-router-dom";

const findMaxPrice = (services: Service[]) => {
  return Math.max(...services.map((service) => service.price));
};

export default function ServiceList() {
  const { services, addService } = useServiceContext();
  const navigate = useNavigate();
  const globalMax = findMaxPrice(services);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    globalMax,
  ]);
  const [searchText, setSearchText] = useState<string>("");

  const filteredServices = services
    .filter((service) =>
      service.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    // filter rewards not in price range
    .filter((service) => {
      return (
        (priceRange[0] === 0 || service.price >= priceRange[0]) &&
        service.price <= priceRange[1]
      );
    })
    .sort((a, b) => a.price - b.price);

  const handleCreateNew = () => {
    const id = addService({ name: "", price: 0, description: "", notes: "" });
    // navigate to edit page
    navigate(`/services/${id}/edit`);
  };

  return (
    <Container>
      <h1>Services</h1>

      {!!filteredServices.length && (
        <>
          <Row className="mb-5">
            <Col xs={12}>
              <PriceRangeSlider
                value={priceRange}
                setPriceRange={setPriceRange}
                max={globalMax}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={12}>
              <InputGroup className="mb-4">
                <Form.Control
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search"
                ></Form.Control>
                <InputGroup.Text>🔎</InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Button onClick={handleCreateNew} className="mb-4">
          Create New
        </Button>
      </Row>
      <Row>
        {filteredServices.map((service) => (
          <Col key={service.id} xs={12}>
            <ViewService service={service} />
            <a href={`/services/${service.id}/edit`}>
              <Button size="sm" className="me-2">
                Load
              </Button>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
