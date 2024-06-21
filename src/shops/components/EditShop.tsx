import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Row, Col, ListGroup } from "react-bootstrap";

import styles from "./EditShop.module.scss";
import { useShopContext } from "../contexts/ShopContext";
import { Shop } from "../types/shop-types";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";
import ViewService from "../../services/components/ViewService";
import { Service } from "../../services/types/service-types";
import BrowseAllItems from "./BrowseAllItems";
import { RewardData } from "../../rewards/types/reward-types";

const EditShop: React.FC = () => {
  const { addShop, updateShop, getShopById, rewards, services } =
    useShopContext();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [shopData, setShopData] = useState<Shop>({
    id: "",
    name: "",
    image: "",
    proprietor: "",
    proprietorImage: "",
    description: "",
    discount: 0,
    forSale: [],
    tier: 1,
  });
  const alreadyAddedIds = shopData.forSale?.map((item) => item.id) || [];

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

  const handleAddForSale = useCallback(
    (type: "reward" | "service", item: RewardData | Service) => {
      setShopData((prevData) => {
        const updatedData: Shop = {
          ...prevData,
          forSale: [
            ...(prevData.forSale || []),
            {
              id: item.id || "",
              type: type as "reward" | "service",
            },
          ],
        };
        if (id) {
          updateShop(updatedData);
        }
        return updatedData;
      });
    },
    [id, updateShop]
  );

  const handleDeleteForSale = (itemIdToDelete: string) => {
    setShopData((prevData) => {
      const newForSale = [...prevData.forSale];
      const index = newForSale.findIndex((item) => item.id === itemIdToDelete);
      newForSale.splice(index, 1);
      const updatedData = {
        ...prevData,
        forSale: newForSale,
      };
      if (id) {
        updateShop({ ...updatedData, id });
      }
      return updatedData;
    });
  };

  return (
    <div style={{ width: "100%", maxWidth: 800 }}>
      <h1>{id ? "Edit: " + shopData.name : "Add Shop"}</h1>
      <Form ref={formRef}>
        <Row>
          <Col xs="12" sm="6">
            <Form.Group className="mb-3" controlId="shopName">
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

            <Form.Group className="mb-3" controlId="shopImage">
              <Form.Label>Shop Image URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={shopData.image}
                onChange={handleChange}
                placeholder="Enter shop image URL"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="tier">
              <Form.Label>Tier</Form.Label>
              <Form.Control
                type="number"
                name="tier"
                value={shopData.tier}
                onChange={handleChange}
                placeholder="Enter tier"
              />
            </Form.Group>
          </Col>
          <Col xs="12" sm="6">
            <Form.Group className="mb-3" controlId="proprietorName">
              <Form.Label>Proprietor Name</Form.Label>
              <Form.Control
                type="text"
                name="proprietor"
                value={shopData.proprietor}
                onChange={handleChange}
                placeholder="Enter proprietor name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="proprietorImage">
              <Form.Label>Proprietor Image URL</Form.Label>
              <Form.Control
                type="text"
                name="proprietorImage"
                value={shopData.proprietorImage}
                onChange={handleChange}
                placeholder="Enter proprietor image URL"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="discount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="discount"
                value={shopData.discount}
                onChange={handleChange}
                placeholder="Enter discount"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="description">
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

        {!id && (
          <Button variant="primary" onClick={handleAddShop}>
            Add
          </Button>
        )}
      </Form>

      <hr className="mb-3" />

      <h2>For Sale</h2>
      <ListGroup className="mb-3">
        {shopData.forSale &&
          shopData.forSale.map((item, index) => {
            const data =
              item.type === "reward"
                ? rewards.find((r) => r.id === item.id)
                : services.find((s) => s.id === item.id);
            if (!data) return null;
            return (
              <ListGroup.Item key={index}>
                <Row>
                  <Col>
                    <Link
                      className={`${styles.forSaleLink}`}
                      to={`/${item.type}s/${item.id}/edit`}
                    >
                      {item.type === "reward" ? (
                        <SingleRewardText
                          reward={initReward(data)}
                          oneLine={true}
                          showPrice={true}
                          noType={true}
                        />
                      ) : (
                        <ViewService service={data as Service} />
                      )}
                    </Link>
                  </Col>
                  <Col xs="2" lg="1" style={{ textAlign: "right" }}>
                    <Button
                      size="sm"
                      className="mx-1"
                      variant="light"
                      onClick={() =>
                        item.id ? handleDeleteForSale(item.id) : null
                      }
                    >
                      ❌
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
      </ListGroup>
      <hr className="mb-3" />
      <h2>Add Items</h2>
      <BrowseAllItems
        handleAddForSale={handleAddForSale}
        alreadyAddedIds={alreadyAddedIds}
      />
    </div>
  );
};

export default EditShop;
