import { useEffect, useState } from "react";

import { useCreatureContext } from "../contexts/CreatureContext";
import { Creature, LegendaryCreature } from "../types/creature-types";
import EditNonLegendary from "./EditNonLegendary";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import EditLegendary from "./EditLegendary";

export function EditCreature({ id }: { id: string }) {
  const { updateCreature, getCreatureById } = useCreatureContext();
  const [creature, setCreature] = useState<
    Creature | LegendaryCreature | null | false
  >(null);

  useEffect(() => {
    const creature = getCreatureById(id);
    setCreature(creature || false);
  }, [getCreatureById, id]);

  useEffect(() => {
    document.title = creature ? `${creature.name} - Edit` : "Edit Creature";
  }, [creature]);

  if (creature === false) {
    return <div>Creature not found</div>;
  }

  if (creature === null) return null;

  return (
    <Form className={`mb-3`}>
      <InputGroup size="lg">
        <InputGroup.Text>Name</InputGroup.Text>
        <Form.Control
          id="rewardName"
          type="text"
          defaultValue={creature.name || ""}
          onChange={(e) =>
            updateCreature({ ...creature, name: e.target.value })
          }
        />
      </InputGroup>
      <Form.Check
        id="legendary"
        type="checkbox"
        label="Legendary"
        defaultChecked={creature.legendary}
        onChange={(e) =>
          updateCreature({ ...creature, legendary: e.target.checked } as
            | Creature
            | LegendaryCreature)
        }
      />
      <Row>
        <Col>
          {/* Description */}
          <InputGroup className={`mt-3`}>
            <InputGroup.Text>Description</InputGroup.Text>
            <Form.Control
              as="textarea"
              defaultValue={creature.description || ""}
              onChange={(e) =>
                updateCreature({ ...creature, description: e.target.value })
              }
            />
          </InputGroup>
        </Col>
        <Col>
          {/* Notes */}
          <InputGroup className={`mt-3`}>
            <InputGroup.Text>Notes</InputGroup.Text>
            <Form.Control
              as="textarea"
              defaultValue={creature.notes || ""}
              onChange={(e) =>
                updateCreature({ ...creature, notes: e.target.value })
              }
            />
          </InputGroup>
        </Col>
      </Row>

      {creature && creature.legendary ? (
        <EditLegendary creature={creature} />
      ) : (
        <EditNonLegendary creature={creature} />
      )}
    </Form>
  );
}
