import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";

import { useShopContext } from "../contexts/ShopContext";
import { Shop } from "../types/shop-types";

type RewardSelectOption = {
  value: string;
  label: string;
};

const EditShop: React.FC = () => {
  const { addShop, updateShop, getShopById, rewards } = useShopContext();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const rewardSelectOptions = rewards.map((reward) => ({
    value: reward.id || "",
    label: reward.name || "",
  }));

  const [selectedReward, setChosenReward] = useState<RewardSelectOption | null>(
    null
  );

  const [shopData, setShopData] = useState<Shop>({
    id: "",
    name: "",
    image: "",
    proprietor: "",
    proprietorImage: "",
    description: "",
    discount: 0,
    rewards: [],
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

  const handleAddReward = () => {
    if (selectedReward) {
      setShopData((prevData) => {
        const reward = rewards.find((r) => r.id === selectedReward.value);
        if (!reward) return prevData;
        const updatedData: Shop = {
          ...prevData,
          rewards: [...(prevData.rewards || []), reward],
        };
        if (id) {
          updateShop(updatedData);
        }
        return updatedData;
      });
      setChosenReward(null); // Reset selected reward after adding
    }
  };

  const handleDeleteReward = (rewardIdToDelete: string) => {
    setShopData((prevData) => {
      const updatedData = {
        ...prevData,
        RewardData: prevData.rewards.filter(
          (reward) => reward.id !== rewardIdToDelete
        ),
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
                value={selectedReward}
                onChange={setChosenReward}
                options={rewardSelectOptions}
                placeholder="Select a reward"
              />
            </Col>
            <Col xs={4}>
              <Button
                variant="primary"
                onClick={handleAddReward}
                disabled={!selectedReward}
              >
                {" "}
                Add Reward{" "}
              </Button>
            </Col>
          </Row>
          <ul>
            {shopData.rewards &&
              shopData.rewards.map((reward, index) => (
                <li key={index}>
                  {reward.name}
                  <Button
                    variant="danger"
                    onClick={() =>
                      reward.id ? handleDeleteReward(reward.id) : null
                    }
                  >
                    Delete
                  </Button>
                </li>
              ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default EditShop;
