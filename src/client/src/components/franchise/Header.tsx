import React from "react";
import { Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import styled from "styled-components";
import { FranchiseUtilities } from "../../utilities/FranchiseAvatar";
import { LeagueLinkContainer } from "../league/controls";
import { useLeagueContext } from "../league/hooks";

interface HeaderProps {
  children?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  const { franchise } = useLeagueContext();

  if (!franchise) return null;

  const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
    franchise.franchiseId
  );

  const championYears = franchise?.teams
    ?.filter((t) => t?.champion)
    .map((t) => t?.year);
  const championYearsText =
    championYears && championYears.length > 0
      ? ` (${championYears.join(", ")})`
      : "";

  const secondYears = franchise?.teams
    ?.filter((t) => t?.secondPlace)
    .map((t) => t?.year);
  const secondYearsText =
    secondYears && secondYears.length > 0 ? ` (${secondYears.join(", ")})` : "";

  return (
    <Container fluid style={{ backgroundColor: "#FFF" }}>
      <Container className="p-3">
        <Row>
          <Col md="auto">
            <Image rounded src={avatar} style={{ width: "10rem" }} />
          </Col>
          <Col className="franchise-header">
            <div className="name">{franchise.mainName}</div>
            <div className="championships">{`${franchise.championships} ${
              franchise.championships === 1 ? "Championship" : "Championships"
            }${championYearsText}`}</div>
            <div className="runnerUps">{`${franchise.runnerUps} ${
              franchise.runnerUps === 1 ? "Runner Up" : "Runner Ups"
            }${secondYearsText}`}</div>
            <div className="stats">
              {franchise.wins}-{franchise.loses}-{franchise.ties}
            </div>
          </Col>
        </Row>
      </Container>
      <SelectNavbar>
        <Container>
          <Navbar.Collapse>
            <Nav className="mr-auto">
              <LeagueLinkContainer to="/">
                <Nav.Link>Overview</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/keepers">
                <Nav.Link>Keepers</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/drafts">
                <Nav.Link>Drafts</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/trades">
                <Nav.Link>Trades</Nav.Link>
              </LeagueLinkContainer>
              <LeagueLinkContainer to="/matchups">
                <Nav.Link>Matchups</Nav.Link>
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
