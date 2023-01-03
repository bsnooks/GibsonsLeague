import React, { useState } from "react";
import { Container, Row, Col, Button, ButtonGroup, Nav, Tab } from "react-bootstrap";
import { useLeagueRecords } from "../hooks/useLeagueRecords";
import { RecordCard } from "../controls";
import { GlobalError, GlobalLoading } from "../../ui";

interface RecordsProps {}

const Records: React.FC<RecordsProps> = () => {
  // state
  const [positionFilter, setPositionFilter] = useState("ALL");

  // hooks
  const { records, loading, error } = useLeagueRecords();

  
  if (loading) return <GlobalLoading mode="page" />;
  if (error) return <GlobalError mode="page" apolloError={error} />;
  
  return (
    <Container>
      <div className="page">
        <Tab.Container defaultActiveKey="franchise">
          <Container fluid style={{ backgroundColor: "#FFF" }}>
            <Container>
              <Nav>
                <Nav.Item className="nav-label">Hall of Fame |</Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="franchise">Franchise Records</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="season">Season Records</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="matchup">Matchup Records</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="player">Player Records</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="playerstats">
                    Player Stat Records
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Container>
          </Container>
          <Container>
            <Tab.Content>
              <Tab.Pane eventKey="franchise">
                <section>
                  <Row>
                    {records
                      ?.filter((r) => r?.type?.toLowerCase() === "franchise")
                      .map((leagueRecord: any, index: number) => (
                        <Col sm key={leagueRecord.recordTitle}>
                          <RecordCard leagueRecord={leagueRecord} />
                        </Col>
                      ))}
                  </Row>
                </section>
              </Tab.Pane>
              <Tab.Pane eventKey="season">
                <section>
                  <Row>
                    {records
                      ?.filter((r) => r?.type?.toLowerCase() === "season")
                      .map((leagueRecord: any) => (
                        <Col sm key={leagueRecord.recordTitle}>
                          <RecordCard leagueRecord={leagueRecord} />
                        </Col>
                      ))}
                  </Row>
                </section>
              </Tab.Pane>
              <Tab.Pane eventKey="matchup">
                <section>
                  <Row>
                    {records
                      ?.filter((r) => r?.type?.toLowerCase() === "match")
                      .map((leagueRecord: any) => (
                        <Col sm key={leagueRecord.recordTitle}>
                          <RecordCard leagueRecord={leagueRecord} />
                        </Col>
                      ))}
                  </Row>
                </section>
              </Tab.Pane>
              <Tab.Pane eventKey="player">
                <section>
                  <Row>
                    <Col>
                      <ButtonGroup>
                        <Button
                          onClick={() => setPositionFilter("ALL")}
                          variant={`${
                            positionFilter === "ALL" ? "primary" : "secondary"
                          }`}
                        >
                          ALL
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("QB")}
                          variant={`${
                            positionFilter === "QB" ? "primary" : "secondary"
                          }`}
                        >
                          QB
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("RB")}
                          variant={`${
                            positionFilter === "RB" ? "primary" : "secondary"
                          }`}
                        >
                          RB
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("WR")}
                          variant={`${
                            positionFilter === "WR" ? "primary" : "secondary"
                          }`}
                        >
                          WR
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("TE")}
                          variant={`${
                            positionFilter === "TE" ? "primary" : "secondary"
                          }`}
                        >
                          TE
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    {records
                      ?.filter(
                        (r) =>
                          r?.type?.toLowerCase() === "player" &&
                          (positionFilter === "ALL" ||
                            r?.recordTitle.endsWith(positionFilter))
                      )
                      .map((leagueRecord: any) => (
                        <Col sm key={leagueRecord.recordTitle}>
                          <RecordCard leagueRecord={leagueRecord} />
                        </Col>
                      ))}
                  </Row>
                </section>
              </Tab.Pane>
              <Tab.Pane eventKey="playerstats">
                <section>
                  <Row>
                    <Col>
                      <ButtonGroup>
                        <Button
                          onClick={() => setPositionFilter("ALL")}
                          variant={`${
                            positionFilter === "ALL" ? "primary" : "secondary"
                          }`}
                        >
                          ALL
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("QB")}
                          variant={`${
                            positionFilter === "QB" ? "primary" : "secondary"
                          }`}
                        >
                          QB
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("RB")}
                          variant={`${
                            positionFilter === "RB" ? "primary" : "secondary"
                          }`}
                        >
                          RB
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("WR")}
                          variant={`${
                            positionFilter === "WR" ? "primary" : "secondary"
                          }`}
                        >
                          WR
                        </Button>
                        <Button
                          onClick={() => setPositionFilter("TE")}
                          variant={`${
                            positionFilter === "TE" ? "primary" : "secondary"
                          }`}
                        >
                          TE
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                  <Row>
                    {records
                      ?.filter(
                        (r) =>
                          r?.type?.toLowerCase() === "playerstats" &&
                          (positionFilter === "ALL" ||
                            r?.recordTitle.endsWith(positionFilter))
                      )
                      .map((leagueRecord: any) => (
                        <Col sm key={leagueRecord.recordTitle}>
                          <RecordCard leagueRecord={leagueRecord} />
                        </Col>
                      ))}
                  </Row>
                </section>
              </Tab.Pane>
            </Tab.Content>
          </Container>
        </Tab.Container>
      </div>
    </Container>
  );
};

export default Records;
