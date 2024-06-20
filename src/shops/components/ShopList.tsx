import React from "react";
import { Button, Card } from "react-bootstrap";
import { Shop } from "../types/shop-types";

interface ShopListProps {}

const ShopListContext = React.createContext<{
  shops: Shop[];
  updateShops: (updatedShops: Shop[]) => void;
}>({
  shops: [],
  updateShops: () => {},
});

const ShopList: React.FC<ShopListProps> = () => {
  const shopsFromLocalStorage = localStorage.getItem("shops");
  const parsedShops = shopsFromLocalStorage
    ? JSON.parse(shopsFromLocalStorage)
    : [];
  const [shops, setShops] = React.useState<Shop[]>(parsedShops);

  const updateShops = (updatedShops: Shop[]) => {
    setShops(updatedShops);
    localStorage.setItem("shops", JSON.stringify(updatedShops));
  };

  return (
    <ShopListContext.Provider value={{ shops, updateShops }}>
      <div>
        {shops.map((shop) => (
          <Card key={shop.id}>
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
        ))}
        <Card key="add" style={{ width: "18rem" }}>
          <Card.Img variant="top" src="https://placehold.co/400x400" />
          <Card.Body>
            <a href="/shop/add">
              <Button variant="primary">Add Shop</Button>
            </a>
          </Card.Body>
        </Card>
      </div>
    </ShopListContext.Provider>
  );
};

export default ShopList;
export { ShopListContext };
