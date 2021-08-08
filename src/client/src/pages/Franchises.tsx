import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import GlobalError from '../components/GlobalError';
import FranchiseStatsRow from '../components/controls/FranchiseStatsRow';
import ChampionsCard from '../components/cards/ChampionsCard';

export const GET_FRANCHISES = gql`
  query GibsonsLeagueQuery {
    franchises {
      franchiseId
      mainName
      wins
      loses
      ties
      points
      championships
      teams
      {
        year
        champion
        secondPlace
      }
    }
  }
`;

interface FranchisesProps { }

const Franchises: React.FC<FranchisesProps> = () => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_FRANCHISES);

    if (loading) return <GlobalLoading mode="page" />;
    if (error || !data) return <GlobalError mode="page" apolloError={error} />;

    return (
        <Container>
            <Row>
                <Col>
                    <div className="section-title">
                        <span>Franchise Stats</span>
                    </div>
                    <div className="section-body p-3">
                        <div className="franchise-list">
                            <div className="franchise-headings">
                                <div className="franchise-col team">Team</div>
                                <div className="franchise-col record">Record</div>
                                <div className="franchise-col points">Points</div>
                                <div className="franchise-col championships">Championships</div>
                            </div>
                            {
                                data.franchises?.slice().sort((a,b) => ((a?.wins ?? 0) > (b?.wins ?? 0)) ? -1 : 1).map((franchise: any) => (
                                    <FranchiseStatsRow key={franchise.franchiseId}
                                        franchise={franchise} />
                                ))
                            }
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="section-title">
                        <span>Champions</span>
                    </div>
                    <div className="section-body p-3">
                        { data.franchises ? <ChampionsCard franchises={data.franchises} /> : null }
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Franchises;