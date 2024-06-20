import { Container, Row, Col } from "react-bootstrap";

import { HexProvider } from "../contexts/HexContext";
import HexGrid from "../components/HexGrid";
import EditHex from "../components/EditHex";
import "bootstrap/dist/css/bootstrap.min.css";

const hexSize = 38;
const hexHeight = Math.sqrt(3) * hexSize;
const hexWidth = 2 * hexSize;

function Map() {
  return (
    <div className="App">
      <HexProvider>
        <Container fluid>
          <Row>
            <Col style={{ textAlign: "center" }}>
              <HexGrid
                width={600}
                height={800}
                hexSize={hexSize}
                image={{
                  url: "https://julietfoundryvtt.s3.us-east-1.amazonaws.com/art/obsidian/636f62c538a7fa96086c4b8999e54336.jpg",
                  width: 4096,
                  height: 3072,
                  offsetX: 0 + hexWidth + hexWidth / 2,
                  offsetY: 25 + hexHeight,
                }}
              />
            </Col>
            <Col style={{ textAlign: "left" }}>
              <EditHex />
            </Col>
          </Row>
        </Container>
      </HexProvider>
    </div>
  );
}

export default Map;
