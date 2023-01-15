import React from "react";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface HeaderProps {
  children?: any;
}

export const Header: React.FC<HeaderProps> = () => {

  return (
    <Container fluid style={{ backgroundColor: "#FFF" }}>
      <SelectNavbar>
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <Link to="/">
                <Nav.Link>Standings</Nav.Link>
              </Link>
              <Link to="/draft">
                <Nav.Link>Draft</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </SelectNavbar>
    </Container>
  );
};

const SelectNavbar = styled(Navbar)`
  z-index: 1019;
`;
