import { Col, Row } from "react-bootstrap";
import { LegendaryCreature } from "../types/creature-types";
import CreatureTier from "./CreatureTier";
import StatblockPickList from "./StatblockPickList";
import { useCreatureContext } from "../contexts/CreatureContext";
import DisplayCreature from "./DisplayCreature";

interface EditLegendaryProps {
  creature: LegendaryCreature;
}

const EditLegendary = ({ creature }: EditLegendaryProps) => {
  const { getCreatureById } = useCreatureContext();

  const statblockIds = new Set(creature.statblocks.map((sb) => sb.id));

  return (
    <Row className={`mt-3`}>
      <Col>
        <StatblockPickList creature={creature} />
      </Col>
      <Col>
        <h4>{creature.name}</h4>
        <CreatureTier creature={creature} />
        <p>{creature.description}</p>
        <ul>
          {creature.statblocks.map((sb, index) => {
            const statblock = getCreatureById(sb.id);
            if (!statblock) return null;
            if (statblock.legendary) return null;
            return (
              <li key={index}>
                {statblock.name} ({sb.type})
              </li>
            );
          })}
        </ul>
        {Array.from(statblockIds).map((id, index) => {
          const statblock = getCreatureById(id);
          if (!statblock) return null;
          if (statblock.legendary) return null;
          return (
            <DisplayCreature
              key={index}
              creature={statblock}
              headingLevel={5}
            />
          );
        })}
        <StatblockPickList creature={creature} adding={false} />
      </Col>
    </Row>
  );
};
export default EditLegendary;
