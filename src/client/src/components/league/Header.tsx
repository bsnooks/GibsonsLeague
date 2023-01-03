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
      <SelectNavbar expand="lg" sticky="top">
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <LinkContainer to="/league/">
                <Nav.Link>Overview</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/league/records">
                <Nav.Link>Records</Nav.Link>
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
