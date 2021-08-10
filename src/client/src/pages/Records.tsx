import React from 'react';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';
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
                    </Tab.Content>
                </Container>
            </Tab.Container>
        </div>
    );
}

export default Records;