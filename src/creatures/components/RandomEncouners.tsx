import { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { makeRandomEnemyTiers } from "../../0.3/util/simulate-enemy";

const RandomEncounters = () => {
  const [totalPCTiers, setTotal] = useState<number>(4);
  const [numPCs, setNumPCs] = useState<number>(4);
  const [maxPCLevel, setMaxPCLevel] = useState<number>(1);
  const [randomEncounters, setRandomEncounters] = useState<number[][]>([]);

  const NUM_ENCOUNTERS = 4;


  useEffect(() => {
    const newEncounters = [];
    for (let i = 0; i < NUM_ENCOUNTERS; i++) {
      newEncounters.push(makeRandomEnemyTiers(totalPCTiers, numPCs, maxPCLevel));
    }
    setRandomEncounters(newEncounters)
  },[maxPCLevel, numPCs, totalPCTiers])

  return (
    <div>
      <Form>
        <Row>
          <Col>
            <InputGroup size="sm">
              <InputGroup.Text>Num PCs</InputGroup.Text>
              <Form.Control
                id="numPCs"
                type="number"
                defaultValue={numPCs}
                onChange={(e) => setNumPCs(Number(e.target.value))}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup size="sm">
              <InputGroup.Text>Total PC Tiers</InputGroup.Text>
              <Form.Control
                id="totalPCTiers"
                type="number"
                defaultValue={totalPCTiers}
                onChange={(e) => setTotal(Number(e.target.value))}
              />
            </InputGroup>
          </Col>
          <Col>
            <InputGroup size="sm">
              <InputGroup.Text>Max PC Level</InputGroup.Text>
              <Form.Control
                id="maxPCLevel"
                type="number"
                defaultValue={maxPCLevel}
                onChange={(e) => setMaxPCLevel(Number(e.target.value))}
              />
            </InputGroup>
          </Col>
        </Row>
      </Form>

      <ul>
        {randomEncounters.map((tiers, index) => (
          <li key={index} >{tiers.sort().join(", ")}</li>
        ))}
      </ul>
    </div>
  );
};

export default RandomEncounters;