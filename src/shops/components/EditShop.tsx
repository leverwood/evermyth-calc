import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { useShopContext } from "../contexts/ShopContext";
import { Shop } from "../types/shop-types";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";
import ViewService from "../../services/components/ViewService";
import { Service } from "../../services/types/service-types";
import BrowseAllItems from "./BrowseAllItems";

const DELIMINATOR = "------";

type ForSaleSelectOption = {
  value: string;
  label: string;
};

const EditShop: React.FC = () => {
  const { addShop, updateShop, getShopById, rewards, services } =
    useShopContext();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const forSaleSelectOptions = [
    ...rewards.map((reward) => ({
      value: `${reward.id || ""}${DELIMINATOR}reward`,
      label: reward.name || "",
    })),
    ...services.map((service) => ({
      value: `${service.id || ""}${DELIMINATOR}service`,
      label: service.name || "",
    })),
  ];
  const [selectedForSale, setSelectedForSale] =
    useState<ForSaleSelectOption | null>(null);

  const [shopData, setShopData] = useState<Shop>({
    id: "",
    name: "",
    image: "",
    proprietor: "",
    proprietorImage: "",
    description: "",
    discount: 0,
    forSale: [],
  });

  useEffect(() => {
    if (id) {
      const shop = getShopById(id);
      if (shop) {
        setShopData(shop);
      }
    }
  }, [id, getShopById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setShopData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (id) {
        updateShop({ ...updatedData, id });
      }
      return updatedData;
    });
  };

  const handleAddShop = () => {
    if (formRef.current && formRef.current.checkValidity()) {
      const newShopId = addShop(shopData);
      navigate(`/shop/${newShopId}/edit`);
    } else {
      formRef.current?.reportValidity();
    }
  };

  const handleAddForSale = () => {
    if (selectedForSale) {
      setShopData((prevData) => {
        const [id, type] = selectedForSale.value.split(DELIMINATOR);

        const updatedData: Shop = {
          ...prevData,
          forSale: [
            ...(prevData.forSale || []),
            {
              id,
              type: type as "reward" | "service",
            },
          ],
        };
        if (id) {
          updateShop(updatedData);
        }
        return updatedData;
      });
      setSelectedForSale(null); // Reset selected item after adding
    }
  };

  const handleDeleteForSale = (itemIdToDelete: string) => {
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        forSale: prevData.forSale.filter((item) => item.id !== itemIdToDelete),
      };
      if (id) {
        updateShop({ ...updatedData, id });
      }
      return updatedData;
    });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h2>{id ? "Edit: " + shopData.name : "Add Shop"}</h2>
          <Form ref={formRef}>
            <Form.Group controlId="shopName">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={shopData.name}
                onChange={handleChange}
                placeholder="Enter shop name"
                required
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="shopImage">
              <Form.Label>Shop Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={shopData.image}
                onChange={handleChange}
                placeholder="Enter shop image URL"
              />
            </Form.Group>

            <Form.Group controlId="proprietorName">
              <Form.Label>Proprietor Name</Form.Label>
              <Form.Control
                type="text"
                name="proprietor"
                value={shopData.proprietor}
                onChange={handleChange}
                placeholder="Enter proprietor name"
              />
            </Form.Group>

            <Form.Group controlId="proprietorImage">
              <Form.Label>Proprietor Image URL</Form.Label>
              <Form.Control
                type="text"
                name="proprietorImage"
                value={shopData.proprietorImage}
                onChange={handleChange}
                placeholder="Enter proprietor image URL"
              />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={shopData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>

            <Form.Group controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="discount"
                value={shopData.discount}
                onChange={handleChange}
                placeholder="Enter discount"
              />
            </Form.Group>

            {!id && (
              <Button variant="primary" onClick={handleAddShop}>
                Add
              </Button>
            )}
          </Form>
          <Row>
            <Col xs={8}>
              <Select
                value={selectedForSale}
                onChange={setSelectedForSale}
                options={forSaleSelectOptions}
                placeholder="Select an item"
              />
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={handleAddForSale}
                disabled={!selectedForSale}
              >
                Add
              </Button>
            </Col>
          </Row>
          <ul>
            {shopData.forSale &&
              shopData.forSale.map((item, index) => {
                const data =
                  item.type === "reward"
                    ? rewards.find((r) => r.id === item.id)
                    : services.find((s) => s.id === item.id);
                if (!data) return null;
                return (
                  <li key={index}>
                    {item.type === "reward" ? (
                      <SingleRewardText
                        reward={initReward(data)}
                        oneLine={true}
                        showPrice={true}
                      />
                    ) : (
                      <ViewService service={data as Service} />
                    )}
                    <a href={`/${item.type}s/${item.id}/edit`}>
                      <Button variant="primary">Load</Button>
                    </a>
                    <Button
                      variant="danger"
                      onClick={() =>
                        item.id ? handleDeleteForSale(item.id) : null
                      }
                    >
                      Delete
                    </Button>
                  </li>
                );
              })}
          </ul>
        </Col>
      </Row>
      <Row>
        <BrowseAllItems />
      </Row>
    </Container>
  );
};

export default EditShop;
