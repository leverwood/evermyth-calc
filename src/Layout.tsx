import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { downloadLocalStorage } from "./util/backup";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container>
          <Navbar.Brand href="/">Evermyth</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Calcs
              </Nav.Link>
              <Nav.Link as={NavLink} to="/rewards">
                Rewards
              </Nav.Link>
              <Nav.Link as={NavLink} to="/players">
                Players
              </Nav.Link>
              <Nav.Link as={NavLink} to="/shop">
                Shops
              </Nav.Link>
              <Nav.Link as={NavLink} to="/services">
                Services
              </Nav.Link>
              <Nav.Link as={NavLink} to="/map">
                Map
              </Nav.Link>
              <Nav.Link as={NavLink} to="/0.2">
                Version 0.2
              </Nav.Link>
              <Button onClick={downloadLocalStorage}>Backup</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{ marginTop: "90px" }}>{children}</Container>
    </>
  );
};

export default Layout;
