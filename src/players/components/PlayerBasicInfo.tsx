import { useCallback, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { PlayerData } from "../types/pc-types";
import { HandleModifyPlayerFunc } from "../types/pc-types";

export function PlayerBasicInfo({
  index,
  player,
  handleModifyPlayer,
}: {
  index: number;
  player: PlayerData;
  handleModifyPlayer: HandleModifyPlayerFunc;
}) {
  const [name, setName] = useState(player.name);
  const [level, setLevel] = useState(player.level.toString());
  const [eduMod, setEduMod] = useState(
    player.eduMod ? player.eduMod.toString() : ""
  );

  const handleChange = useCallback(
    (key: "name" | "level" | "eduMod", value: string) => {
      if (key === "name") {
        setName(value);
      } else if (key === "level") {
        setLevel(value);
      } else if (key === "eduMod") {
        setEduMod(value);
      }

      let storedValue =
        key === "level" || key === "eduMod" ? parseInt(value) : value;
      if (typeof storedValue === "number" && isNaN(storedValue)) {
        storedValue = 1;
      }

      const newPlayerData: PlayerData = {
        ...player,
        [key]: storedValue,
      };

      handleModifyPlayer(newPlayerData.id, newPlayerData, "update");
    },
    [player, handleModifyPlayer]
  );

  return (
    <Form as={Row}>
      <Form.Group as={Col} className={"mb-2"}>
        <Form.Label htmlFor={`player-${index}`}>Character</Form.Label>
        <Form.Control
          id={`player-${index}`}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </Form.Group>
      <Form.Group as={Col} className={"mb-2"}>
        <Form.Label htmlFor={`level-${index}`}>Level</Form.Label>
        <Form.Control
          id={`level-${index}`}
          type="number"
          value={level}
          onChange={(e) => handleChange("level", e.target.value)}
          min={1}
        />
      </Form.Group>
      <Form.Group as={Col} className={"mb-4"}>
        <Form.Label htmlFor={`eduMod-${index}`}>EDU mod</Form.Label>
        <Form.Control
          id={`eduMod-${index}`}
          type="number"
          value={eduMod}
          onChange={(e) => handleChange("eduMod", e.target.value)}
          min={0}
        />
      </Form.Group>
    </Form>
  );
}
