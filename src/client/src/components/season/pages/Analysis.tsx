import React from "react";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { KeepersAnalysis, MatchupAnalysis, PlayerStatsAnalysis, SeasonWinsAnalysis } from "../controls";

interface AnalysisProps {}

const Analysis: React.FC<AnalysisProps> = ({ ...props }) => {
  return (
        <Tab.Container id="left-tabs-example" defaultActiveKey="stats">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="stats">Player Stats</Nav.Link>
                  <Nav.Link eventKey="keepers">Keepers</Nav.Link>
                  <Nav.Link eventKey="matchups">Team Points</Nav.Link>
                  <Nav.Link eventKey="wins">Wins</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="stats">
                  <PlayerStatsAnalysis />
                </Tab.Pane>
                <Tab.Pane eventKey="keepers">
                  <KeepersAnalysis />
                </Tab.Pane>
                <Tab.Pane eventKey="matchups">
                  <MatchupAnalysis />
                </Tab.Pane>
                <Tab.Pane eventKey="wins">
                  <SeasonWinsAnalysis />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
  );
};

export default Analysis;
