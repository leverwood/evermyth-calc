import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";

import { useCreatureContext } from "../contexts/CreatureContext";
import { Creature, LegendaryCreature } from "../types/creature-types";
import { LOG_LEVEL, Logger } from "../../util/log";
import SingleCreatureText from "./SingleCreatureText";
import { RewardProvider } from "../../rewards/contexts/RewardContext";
import RandomEncounters from "./RandomEncouners";

export const logger = Logger(LOG_LEVEL.INFO);

export default function CreatureList() {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState<string>(
    params.get("search") || ""
  );
  const { creatures, addCreature, getCreatureById, deleteCreature } =
    useCreatureContext();
  const [filteredCreatures, setFilteredCreatures] =
    useState<(Creature | LegendaryCreature)[]>(creatures);

  useEffect(() => {
    setFilteredCreatures(
      creatures.filter((c) => {
        return c.name.toLowerCase().includes(searchText.toLowerCase());
      })
    );
  }, [creatures, searchText]);

  const handleCreateNew = () => {
    const id = addCreature({
      name: "",
      legendary: false,
    });
    // navigate to edit page
    navigate(`/creatures/${id}/edit`);
  };

  const handleSetSearchText = useCallback((text: string) => {
    setSearchText(text);

    // store in url
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("search", text);
    url.search = params.toString();
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleClickCopy = useCallback(
    (id: string | undefined) => {
      logger.debug("----- handleClickCopy ------", id);
      if (!id) return;
      const creatureToCopy = getCreatureById(id);
      if (!creatureToCopy) return;
      const newCreature = {
        ...creatureToCopy,
        name: creatureToCopy?.name + " Copy",
        id: undefined,
      };
      addCreature(newCreature);
    },
    [addCreature, getCreatureById]
  );

  const handleClickDelete = (id: string | undefined) => {
    if (id) deleteCreature(id);
  };

  return (
    <RewardProvider>
      <div>
        <h1>Creature Creator</h1>
        <span className={`me-2`}>Count: {filteredCreatures.length}</span>
        <Button onClick={handleCreateNew} className="mb-4">
          Create New
        </Button>
        <RandomEncounters />

        <InputGroup className="mb-4">
          <Form.Control
            value={searchText}
            onChange={(e) => handleSetSearchText(e.target.value)}
            placeholder="Search"
          ></Form.Control>
          <InputGroup.Text>🔎</InputGroup.Text>
        </InputGroup>

        <ListGroup>
          {filteredCreatures.map((c) => (
            <ListGroup.Item className={`d-flex`} key={c.id}>
              <div className={`flex-grow-1`}>
                <SingleCreatureText creature={c} oneLine={true} />
              </div>
              <div className={`flex-shrink-1 d-flex align-items-center`}>
                <a href={`/creatures/${c.id}/edit`} className="me-2">
                  <Button size="sm" className="me-2">
                    Load
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleClickCopy(c.id)}
                >
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleClickDelete(c.id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </RewardProvider>
  );
}
