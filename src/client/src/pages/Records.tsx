import React from 'react';
import { Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import RecordCard from '../components/RecordCard';

export const GET_FRANCHISES = gql`
  query GibsonsLeagueQuery {
    league
    {
      records(number:5)
      {
        recordTitle
        top
        {
          rank
          franchiseId
          franchiseName
          recordValue
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

    if (loading) return <GlobalLoading />;
    if (error || !data) return <p>ERROR</p>;

    return (
        <Container>
            <section className="card-columns">
                {
                    data.league?.records?.map((leagueRecord: any) => (
                        <RecordCard key={leagueRecord.recordTitle}
                            leagueRecord={leagueRecord} />
                    ))
                }
            </section>
        </Container>
    );
}

export default Records;