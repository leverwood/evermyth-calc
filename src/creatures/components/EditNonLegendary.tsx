import { useCallback, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

import { useCreatureContext } from "../contexts/CreatureContext";
import { ChangeValueFunc, Creature } from "../types/creature-types";
import { AddCreatureReward } from "./AddCreatureReward";
import DisplayCreature from "./DisplayCreature";

const EditNonLegendary = ({ creature }: { creature: Creature }) => {
  const { updateCreature } = useCreatureContext();
  const [searchString, setSearchString] = useState("");


  const changeValue = useCallback<ChangeValueFunc>(
    (key, value, index = -1) => {
      if (!creature) return;
      const newCreature: Creature = { ...creature };
      let newKey = key;
      let newValue: Creature[keyof Creature] = value;
      switch (key) {
        case "addReward":
          newKey = "rewards";
          newValue = [...newCreature.rewards, value as string];
          break;
        case "deleteReward":
          newKey = "rewards";
          newValue = newCreature.rewards.filter((r) => r !== value);
          break;
        default:
          (newCreature as any)[key] = value;
      }
      const newState: Creature = {
        ...creature,
        [newKey]: newValue,
      };
      updateCreature(newState);
    },
    [creature, updateCreature]
  );

  if (creature === null) return <div>Loading...</div>;

  return (
    <Row className={`mt-3`}>
      <Col>
        <InputGroup className={`mt-3`}>
          <InputGroup.Text>Tier</InputGroup.Text>
          <Form.Control
            type="number"
            defaultValue={creature.tier}
            onChange={(e) => changeValue("tier", parseFloat(e.target.value))}
          />
        </InputGroup>

        <InputGroup className="mb-4 mt-4">
          <Form.Control
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search"
          ></Form.Control>
          <InputGroup.Text>🔎</InputGroup.Text>
        </InputGroup>

        <AddCreatureReward
          creature={creature}
          changeValue={changeValue}
          searchString={searchString}
        />
      </Col>
      <Col>
        <DisplayCreature creature={creature} />

        <AddCreatureReward
          adding={false}
          creature={creature}
          changeValue={changeValue}
          searchString={searchString}
        />
      </Col>
    </Row>
  );
};

export default EditNonLegendary;
