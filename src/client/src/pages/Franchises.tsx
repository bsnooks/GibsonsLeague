import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery } from '../generated/graphql';
import GlobalError from '../components/GlobalError';
import FranchiseStatsRow from '../components/controls/FranchiseStatsRow';
import ChampionsCard from '../components/cards/ChampionsCard';
import { FranchiseUtilities } from '../utilities/FranchiseAvatar';

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

    const currentChamp = data.franchises?.filter(f => f?.franchiseId === "bbe2d0ad-54cf-4c22-be82-b2a5f262a157")[0];
    const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(currentChamp?.franchiseId);

    return (
        <Container>
            <Row>
                <Col sm>
                    <div className="section-title">
                        <span>Current Champion</span>
                    </div>
                    <div className="section-body p-3">
                        <Image rounded src={avatar} style={{ width: '10rem' }} /><br/>
                        <div className="franchise-header text-center">
                            <div className="name">{currentChamp?.mainName}</div>         
                        </div>          
                    </div>
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
                <Col sm>
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