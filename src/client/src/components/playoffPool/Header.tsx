import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
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
              <LinkContainer to="/playoffs">
                <Nav.Link>Standings</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/playoffs/draft">
                <Nav.Link>Draft</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/playoffs/stats">
                <Nav.Link>Stats</Nav.Link>
              </LinkContainer>
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
