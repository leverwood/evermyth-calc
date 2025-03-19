import { useCallback, useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

import { useCreatureContext } from "../contexts/CreatureContext";
import { ChangeValueFunc, Creature } from "../types/creature-types";
import { useRewardContext } from "../../rewards/contexts/RewardContext";
import { AddCreatureReward } from "./AddCreatureReward";
import { SingleRewardText } from "../../rewards/components/SingleRewardText";
import { initReward } from "../../rewards/util/reward-calcs";

export function EditCreature({ id }: { id: string }) {
  const { updateCreature, getCreatureById } = useCreatureContext();
  const [creature, setCreature] = useState<Creature | null | false>(null);
  const [searchString, setSearchString] = useState("");
  const { getRewardById } = useRewardContext();

  useEffect(() => {
    const creature = getCreatureById(id);
    setCreature(creature || false);
  }, [getCreatureById, id]);

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

  if (creature === false) {
    return <div>Creature not found</div>;
  }
  if (creature === null) return <div>Loading...</div>;

  return (
    <Form className={`mb-3`}>
      <InputGroup size="lg">
        <InputGroup.Text>Name</InputGroup.Text>
        <Form.Control
          id="rewardName"
          type="text"
          value={creature.name || ""}
          onChange={(e) => changeValue("name", e.target.value)}
        />
      </InputGroup>

      <Row>
        <Col>
          <InputGroup className={`mt-3`}>
            <InputGroup.Text>Tier</InputGroup.Text>
            <Form.Control
              type="number"
              value={creature.tier}
              onChange={(e) => changeValue("tier", parseInt(e.target.value))}
            />
          </InputGroup>

          {/* Description */}
          <InputGroup className={`mt-3`}>
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              as="textarea"
              value={creature.description || ""}
              onChange={(e) => changeValue("description", e.target.value)}
            />
          </InputGroup>

          {/* Notes */}
          <InputGroup className={`mt-3`}>
            <InputGroup.Text>Notes</InputGroup.Text>
            <Form.Control
              as="textarea"
              value={creature.notes || ""}
              onChange={(e) => changeValue("notes", e.target.value)}
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
          <p className={`mt-3`}>
            <strong>{creature.name}</strong>
            <br />T{creature.tier} |{" "}
            {creature.overridePool || Math.max(1, creature.tier * 4)} Pool |
            Target {creature.overrideTarget || 10 + creature.tier} | WS{" "}
            {creature.overrideWellspring || creature.tier * 2}
          </p>
          <ul>
            {creature.rewards.map((rewardId, index) => {
              const reward = getRewardById(rewardId);
              if (!reward) return null;
              return (
                <li key={index}>
                  <SingleRewardText
                    reward={initReward(reward)}
                    oneLine={true}
                  />
                </li>
              );
            })}
          </ul>
          <p>{creature.description}</p>

          <AddCreatureReward
            adding={false}
            creature={creature}
            changeValue={changeValue}
            searchString={searchString}
          />
        </Col>
      </Row>
    </Form>
  );
}
