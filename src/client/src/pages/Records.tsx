import React from 'react';
import { Container, Jumbotron, Tab, Tabs } from 'react-bootstrap';
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



    return (
        <Container>
            <Jumbotron fluid>
                <h1>Hall of Fame</h1>
            </Jumbotron>
            <Tabs defaultActiveKey="franchise">
                <Tab eventKey="franchise" title="Franchise Records">
                    <div className="d-flex flex-wrap justify-content-center">
                        {
                            data.league?.records?.filter(r => r?.type?.toLowerCase() === "franchise").map((leagueRecord: any) => (
                                <RecordCard key={leagueRecord.recordTitle}
                                    leagueRecord={leagueRecord} />
                            ))
                        }
                    </div>
                </Tab>
                <Tab eventKey="season" title="Season Records">
                    <div className="d-flex flex-wrap justify-content-center">
                        {
                            data.league?.records?.filter(r => r?.type?.toLowerCase() === "season").map((leagueRecord: any) => (
                                <RecordCard key={leagueRecord.recordTitle}
                                    leagueRecord={leagueRecord} />
                            ))
                        }
                    </div>
                </Tab>
                <Tab eventKey="matchup" title="Matchup Records">
                    <div className="d-flex flex-wrap justify-content-center">
                        {
                            data.league?.records?.filter(r => r?.type?.toLowerCase() === "match").map((leagueRecord: any) => (
                                <RecordCard key={leagueRecord.recordTitle}
                                    leagueRecord={leagueRecord} />
                            ))
                        }
                    </div>
                </Tab>
                {/* <Tab eventKey="player" title="Player Records">
                    <div className="d-flex flex-wrap justify-content-center">
                        {
                            data.league?.records?.filter(r => r?.type?.toLowerCase() === "player").map((leagueRecord: any) => (
                                <RecordCard key={leagueRecord.recordTitle}
                                    leagueRecord={leagueRecord} />
                            ))
                        }
                    </div>
                </Tab> */}
            </Tabs>
        </Container>
    );
}

export default Records;