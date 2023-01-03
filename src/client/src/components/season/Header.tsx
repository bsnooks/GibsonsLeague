import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import styled from "styled-components";
import { LeagueLinkContainer } from "../league/controls";
import { useLeagueContext } from "../league/hooks";

interface HeaderProps {
  children?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  // hooks
  const { season, franchise } = useLeagueContext();

  return (
    <Container fluid style={{ backgroundColor: "#FFF" }}>
      <SelectNavbar expand="lg" sticky="top">
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto">
              {season?.finished && (
                <LeagueLinkContainer to="/playoffs">
                  <Nav.Link>Playoffs</Nav.Link>
                </LeagueLinkContainer>
              )}
              <LeagueLinkContainer to="/standings">
                <Nav.Link>Standings</Nav.Link>
              </LeagueLinkContainer>
              {franchise && (
                <LeagueLinkContainer to={`/roster`}>
                  <Nav.Link>Roster</Nav.Link>
                </LeagueLinkContainer>
              )}
              <LeagueLinkContainer to="/stats">
                <Nav.Link>Stats</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/keepers">
                <Nav.Link>Keepers</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/draft">
                <Nav.Link>Draft</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/matchups">
                <Nav.Link>Matchups</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/trades">
                <Nav.Link>Trades</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/analysis">
                <Nav.Link>Analysis</Nav.Link>
              </LeagueLinkContainer>
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
