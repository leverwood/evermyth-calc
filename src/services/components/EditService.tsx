import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useServiceContext } from "../contexts/ServiceContext";
import { Service } from "../types/service-types";
import ShopCategoryCheckboxes from "../../shops/components/ShopCategoryCheckboxes";
import { ShopProvider } from "../../shops/contexts/ShopContext";

const EditService: React.FC = () => {
  const { addService, updateService, getServiceById, deleteService } =
    useServiceContext();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [serviceData, setServiceData] = useState<Service>({
    id: "",
    name: "",
    description: "",
    notes: "",
    price: 0,
  });
  const [checkedCategories, setChecked] = useState<string[]>(
    id ? getServiceById(id)?.shopCategories || [] : []
  );

  useEffect(() => {
    if (id) {
      const service = getServiceById(id);
      if (service) {
        setServiceData(service);
      }
    }
  }, [id, getServiceById]);

  useEffect(() => {
    if (id) {
      const newServiceData = {
        ...serviceData,
        shopCategories: checkedCategories,
      };
      updateService(newServiceData);
    }
  }, [checkedCategories, id, serviceData, updateService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (id) {
        updateService({ ...updatedData, id });
      }
      return updatedData;
    });
  };

  const handleAddService = () => {
    if (formRef.current && formRef.current.checkValidity()) {
      const newServiceId = addService(serviceData);
      navigate(`/services/${newServiceId}/edit`);
    } else {
      formRef.current?.reportValidity();
    }
  };

  const handleDeleteService = () => {
    if (id) {
      deleteService(id);
      navigate("/services");
    }
  };

  return (
    <ShopProvider>
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={8}>
            <h2>{id ? "Edit: " + serviceData.name : "Add Service"}</h2>
            <Form ref={formRef}>
              <Form.Group className="mb-3" controlId="serviceName">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={serviceData.name}
                  onChange={handleChange}
                  placeholder="Enter service name"
                  required
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="servicePrice">
                <Form.Label>Service Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={serviceData.price}
                  onChange={handleChange}
                  placeholder="Enter service price"
                  required
                  min="0"
                  step="0.01"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="serviceDescription">
                <Form.Label>Service Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={serviceData.description}
                  onChange={handleChange}
                  placeholder="Enter service description"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="serviceNotes">
                <Form.Label>Service Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={serviceData.notes}
                  onChange={handleChange}
                  placeholder="Enter service notes"
                />
              </Form.Group>

              <div className="mb-3">
                <ShopCategoryCheckboxes
                  checkedCategories={checkedCategories}
                  setChecked={setChecked}
                />
              </div>

              {!id && (
                <Button variant="primary" onClick={handleAddService}>
                  Add
                </Button>
              )}

              {id && (
                <Button variant="danger" onClick={handleDeleteService}>
                  Delete
                </Button>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
    </ShopProvider>
  );
};

export default EditService;
