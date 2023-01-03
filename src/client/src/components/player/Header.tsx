import React from "react";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import styled from "styled-components";
import { PlayerLinkContainer } from "./controls";
import { usePlayerContext } from "./hooks";

interface HeaderProps {
  children?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  const { player } = usePlayerContext();

  if (!player) return null;

  const avatar = undefined;
  const initials = player.name.match(/(\b\S)?/g)?.join("").match(/(^\S|\S$)?/g)?.join("").toUpperCase();

  return (
    <Container fluid style={{ backgroundColor: "#FFF" }}>
      <Container className="p-3">
        <Row>
          <Col md="auto">
            { avatar && <Image rounded src={avatar} style={{ width: "10rem" }} /> }
            { !avatar && <PlayerInitials><div>{initials}</div></PlayerInitials>}
          </Col>
          <Col className="franchise-header">
            <div className="name">{player.name}</div>
          </Col>
        </Row>
      </Container>
      <SelectNavbar expand="lg" sticky="top">
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <PlayerLinkContainer to="/">
                <Nav.Link>Overview</Nav.Link>
              </PlayerLinkContainer>
              <PlayerLinkContainer to="/transactions">
                <Nav.Link>Transactions</Nav.Link>
              </PlayerLinkContainer>
              <PlayerLinkContainer to="/games">
                <Nav.Link>Games</Nav.Link>
              </PlayerLinkContainer>
              <PlayerLinkContainer to="/analyze">
                <Nav.Link>Analyze</Nav.Link>
              </PlayerLinkContainer>
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

const PlayerInitials = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 5rem;
  height: 5rem;
  font-size: 2em;
  background-color: #ccc;
  border-radius: 50%;
  div {
    width: 100%;
  }
`;