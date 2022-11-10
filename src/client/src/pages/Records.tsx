import React, { useState } from 'react';
import { Button, ButtonGroup, Col, Container, Nav, Row, Tab } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import RecordCard from '../components/cards/RecordCard';
import GlobalError from '../components/GlobalError';

export const GET_FRANCHISES = gql`
  query GibsonsLeagueQuery {
    league
    {
      records(number:10, positivity:true)
      {
        recordTitle
        positiveRecord
        type
        top
        {
          rank
          franchiseId
          franchiseName
          otherFranchiseId
          otherFranchiseName
          playerId
          playerName
          playerPosition
          recordValue
          recordNumericValue
          year
          week
        }
      }
    }
  }
`;

interface RecordsProps { }

const Records: React.FC<RecordsProps> = () => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_FRANCHISES);

    const [positionFilter, setPositionFilter] = useState("ALL");

    if (loading) return <GlobalLoading mode="page" />;
    if (error || !data) return <GlobalError mode="page" apolloError={error} />;

    const urlParams = new URLSearchParams(window.location.search);
    const defaultTab = urlParams.get('t') ?? "franchise";


    return (
        <div className="page">
            <Tab.Container defaultActiveKey={defaultTab}>
                <Container fluid style={{ backgroundColor: "#FFF" }}>
                    <Container>
                        <Nav>
                            <Nav.Item className="nav-label">Hall of Fame |</Nav.Item>
                            <Nav.Item><Nav.Link eventKey="franchise">Franchise Records</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="season">Season Records</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="matchup">Matchup Records</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="player">Player Records</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link eventKey="playerstats">Player Stat Records</Nav.Link></Nav.Item>
                        </Nav>
                    </Container>
                </Container>
                <Container>
                    <Tab.Content>
                        <Tab.Pane eventKey="franchise">
                            <section>
                                <Row>
                                    {
                                        data.league?.records?.filter(r => r?.type?.toLowerCase() === "franchise").map((leagueRecord: any, index: number) => (
                                            <Col sm key={leagueRecord.recordTitle}>
                                                <RecordCard leagueRecord={leagueRecord} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </section>
                        </Tab.Pane>
                        <Tab.Pane eventKey="season">
                            <section>
                                <Row>
                                    {
                                        data.league?.records?.filter(r => r?.type?.toLowerCase() === "season").map((leagueRecord: any) => (
                                            <Col sm key={leagueRecord.recordTitle}>
                                                <RecordCard leagueRecord={leagueRecord} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </section>
                        </Tab.Pane>
                        <Tab.Pane eventKey="matchup">
                            <section>
                                <Row>
                                    {
                                        data.league?.records?.filter(r => r?.type?.toLowerCase() === "match").map((leagueRecord: any) => (
                                            <Col sm key={leagueRecord.recordTitle}>
                                                <RecordCard leagueRecord={leagueRecord} />
                                            </Col>
                                        ))
                                    }
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
                                                variant={`${positionFilter === "ALL" ? "primary" : "secondary"}`}>
                                                ALL
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("QB")}
                                                variant={`${positionFilter === "QB" ? "primary" : "secondary"}`}>
                                                QB
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("RB")}
                                                variant={`${positionFilter === "RB" ? "primary" : "secondary"}`}>
                                                RB
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("WR")}
                                                variant={`${positionFilter === "WR" ? "primary" : "secondary"}`}>
                                                WR
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("TE")}
                                                variant={`${positionFilter === "TE" ? "primary" : "secondary"}`}>
                                                TE
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {
                                        data.league?.records?.filter(r => r?.type?.toLowerCase() === "player" && (positionFilter === "ALL" || r?.recordTitle.endsWith(positionFilter))).map((leagueRecord: any) => (
                                            <Col sm key={leagueRecord.recordTitle}>
                                                <RecordCard leagueRecord={leagueRecord} />
                                            </Col>
                                        ))
                                    }
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
                                                variant={`${positionFilter === "ALL" ? "primary" : "secondary"}`}>
                                                ALL
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("QB")}
                                                variant={`${positionFilter === "QB" ? "primary" : "secondary"}`}>
                                                QB
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("RB")}
                                                variant={`${positionFilter === "RB" ? "primary" : "secondary"}`}>
                                                RB
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("WR")}
                                                variant={`${positionFilter === "WR" ? "primary" : "secondary"}`}>
                                                WR
                                            </Button>
                                            <Button 
                                                onClick={() => setPositionFilter("TE")}
                                                variant={`${positionFilter === "TE" ? "primary" : "secondary"}`}>
                                                TE
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    {
                                        data.league?.records?.filter(r => r?.type?.toLowerCase() === "playerstats" && (positionFilter === "ALL" || r?.recordTitle.endsWith(positionFilter))).map((leagueRecord: any) => (
                                            <Col sm key={leagueRecord.recordTitle}>
                                                <RecordCard leagueRecord={leagueRecord} />
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </section>
                        </Tab.Pane>
                    </Tab.Content>
                </Container>
            </Tab.Container>
        </div>
    );
}

export default Records;