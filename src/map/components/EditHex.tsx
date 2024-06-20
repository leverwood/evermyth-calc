// src/components/EditHex.tsx
import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import { HexCoordinate, useHexContext } from "../contexts/HexContext";

const EditHex: React.FC = () => {
  const { clickedHex, coordinates, updateCoordinates } = useHexContext();
  const [hexData, setHexData] = useState<HexCoordinate>({
    col: clickedHex?.col || 0,
    row: clickedHex?.row || 0,
    revealed: false,
    owned: false,
    primalumina: false,
    text: "",
  });

  useEffect(() => {
    if (clickedHex) {
      const data = coordinates.find(
        (coord) => coord.col === clickedHex.col && coord.row === clickedHex.row
      );
      setHexData(
        data || { ...clickedHex, revealed: false, owned: false, text: "" }
      );
    }
  }, [clickedHex, coordinates]);

  if (!clickedHex) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const updatedHexData = {
      ...hexData,
      [name]: type === "checkbox" ? checked : value,
    };
    setHexData(updatedHexData);

    // Update coordinates immediately
    const updatedCoordinates = coordinates.map((coord) =>
      coord.col === clickedHex.col && coord.row === clickedHex.row
        ? { ...coord, ...updatedHexData }
        : coord
    );
    if (
      !coordinates.find(
        (coord) => coord.col === clickedHex.col && coord.row === clickedHex.row
      )
    ) {
      updatedCoordinates.push(updatedHexData);
    }
    updateCoordinates(updatedCoordinates);
  };

  return (
    <Container style={{ maxWidth: 500 }}>
      <h3>
        Editing Hex ({clickedHex.col}, {clickedHex.row})
      </h3>
      <Form>
        <Form.Group controlId="formRevealed">
          <Form.Check
            type="checkbox"
            name="revealed"
            label="Revealed"
            checked={hexData.revealed}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formOwned">
          <Form.Check
            type="checkbox"
            name="owned"
            label="Owned"
            checked={hexData.owned}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formOwned">
          <Form.Check
            type="checkbox"
            name="primalumina"
            label="Primalumina"
            checked={hexData.primalumina}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formText">
          <Form.Label>Text</Form.Label>
          <Form.Control
            type="text"
            name="text"
            value={hexData.text}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
    </Container>
  );
};

export default EditHex;
