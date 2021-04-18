import React from 'react';
import { Col, Container, Jumbotron, Row, Image, Tabs, Tab } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import SeasonBadge from '../components/cards/SeasonBadge';
import { FranchiseUtilities } from '../utilities/FranchiseAvatar';
import FranchiseTrades from '../components/FranchiseTrades';
import FranchiseDraftPicks from '../components/FranchiseDraftPicks';
import FranchiseKeepers from '../components/FranchiseKeepers';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    franchise(id: $id) {
      mainName
      wins
      loses
      ties
      championships
      runnerUps
      points
      tradeCount
      teams
      {
        year
        standing
        champion
        secondPlace
      }
    }
  }
`;

interface FranchiseProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Franchise: React.FC<FranchiseProps> = ({ ...props }) => {

  const franchiseId = props.match.params.id;

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    {
      variables: {
        id: franchiseId
      }
    }
  );

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.franchise) return <p>Not Found</p>;

  const avatar = props.image || new FranchiseUtilities().pickAvatarByFranchiseId(franchiseId);
  const franchise = data.franchise;

  return (
    <Container>
      <Jumbotron fluid>
        <Container>
          <Row>
            <Col md="auto">
              <Image rounded src={avatar} style={{ width: '18rem' }} />
            </Col>
            <Col>
              <h1>{franchise.mainName}</h1>
              {
                franchise.teams?.map((team: any) => (
                  <SeasonBadge key={team.year}
                    year={team.year}
                    place={team.standing}
                    champion={team.champion}
                    runnerUp={team.secondPlace}
                    franchiseId={franchiseId} />
                ))
              }
              <Row>
                <Col>Record: {franchise.wins}-{franchise.loses}-{franchise.ties}</Col>
                <Col>Championships: {franchise.championships}</Col>
                <Col>Runner Ups: {franchise.runnerUps}</Col>
              </Row>
              <Row>
                <Col>Points: {Number(franchise.points ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</Col>
                <Col>Trades: {franchise.tradeCount}</Col>
                <Col></Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Tabs defaultActiveKey="trades">
        <Tab eventKey="trades" title="Trades">
          <FranchiseTrades franciseId={franchiseId} />
        </Tab>
        <Tab eventKey="keepers" title="Keepers">
          <FranchiseKeepers franciseId={franchiseId} />
        </Tab>
        <Tab eventKey="drafts" title="Drafts">
          <FranchiseDraftPicks franciseId={franchiseId} />
        </Tab>
      </Tabs>

    </Container>
  );
}

export default Franchise;