import { useEffect, useState } from "react";
import { useCreatureContext } from "../contexts/CreatureContext";
import {
  Creature,
  LegendaryCreature,
  STATBLOCK_TYPE,
} from "../types/creature-types";
import { Button, Form, InputGroup } from "react-bootstrap";

interface StatblockPickListProps {
  creature: LegendaryCreature;
  adding?: boolean;
}

const StatblockPickList = ({
  creature,
  adding = true,
}: StatblockPickListProps) => {
  const { creatures, updateCreature, getCreatureById } = useCreatureContext();
  const [filteredCreatures, setFilteredCreatures] = useState<Creature[]>([]);
  const [search, setSearch] = useState<string>("");
  const [statblockType, setStatblockType] = useState<STATBLOCK_TYPE>(
    STATBLOCK_TYPE.BODY_PART
  );

  useEffect(() => {
    if (adding) {
      const filtered: Creature[] = creatures.filter(
        (c) =>
          !c.legendary && c.name.toLowerCase().includes(search.toLowerCase())
      ) as Creature[];
      setFilteredCreatures(filtered);
    } else {
      const filtered: Creature[] = creature.statblocks.map(
        (sb) => getCreatureById(sb.id) as Creature
      ).filter(c=>c);
      setFilteredCreatures(filtered);
    }
  }, [adding, creature.statblocks, creatures, getCreatureById, search]);

  return (
    <>
      {adding && (
        <>
          <InputGroup className="mb-4 mt-4">
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            ></Form.Control>
            <InputGroup.Text>🔎</InputGroup.Text>
          </InputGroup>
          <InputGroup className="mb-4">
            <Form.Label className="px-4 py-2">Statblock Type</Form.Label>
            <Form.Select
              value={statblockType}
              onChange={(e) =>
                setStatblockType(e.target.value as unknown as STATBLOCK_TYPE)
              }
            >
              <option value={STATBLOCK_TYPE.BODY_PART}>Body Part</option>
              <option value={STATBLOCK_TYPE.PHASE}>Phase</option>
              <option value={STATBLOCK_TYPE.LAIR}>Lair</option>
            </Form.Select>
          </InputGroup>
        </>
      )}
      <ul>
        {adding ? filteredCreatures.map((c) => {
          if (!c.legendary) {
            return (
              <li key={c.id}>
                <Button
                  size="sm"
                  className={`me-2`}
                  variant={`${adding ? "secondary" : "outline-danger"}`}
                  onClick={() => {
                      updateCreature({
                        ...creature,
                        statblocks: [
                          ...creature.statblocks,
                          { type: statblockType, id: c.id },
                        ],
                      });
                  }}
                >
                  {adding ? "+" : "x"}
                </Button>
                {c.name} (T{c.tier}) 
              </li>
            );
          } else return null;
        }) : creature.statblocks.map((sb, index) => {
          const statblock = getCreatureById(sb.id);
          if (statblock && !statblock.legendary) {
            return (
              <li key={index}>
                <Button
                  size="sm"
                  className={`me-2`}
                  variant={`${adding ? "secondary" : "outline-danger"}`}
                  onClick={() => {
                    const newStatblocks = [...creature.statblocks];
                    newStatblocks.splice(index, 1);
                    updateCreature({
                      ...creature,
                      statblocks: newStatblocks,
                    });
                  }}
                >
                  {adding ? "+" : "x"}
                </Button>
                {statblock.name} (T{statblock.tier}). {sb.type}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </>
  );
};

export default StatblockPickList;
