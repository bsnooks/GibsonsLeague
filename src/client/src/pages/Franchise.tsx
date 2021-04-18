import React from 'react';
import { Col, Container, Jumbotron, Row, Image, Button } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import SeasonBadge from '../components/SeasonBadge';
import TradeCard from '../components/TradeCard';
import { FranchiseUtilities } from '../utilities/FranchiseAvatar';

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
      trades(limit:100)
      {
        tradeId
        date
        franchiseId
        franchiseName
        tradedWithFranchiseId
        tradedWithFranchiseName
        tradedfor
        {
          playerId
          name
        }
        tradedaway
        {
          playerId
          name
        }
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

  const {
    data,
    loading,
    error,
    fetchMore
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    {
      variables: {
        id: props.match.params.id
      }
    }
  );

  const handleClick = () => {
    fetchMore({
      variables: {
        id: props.match.params.id
      }
    })
  };

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.franchise) return <p>Not Found</p>;

  const avatar = props.image || new FranchiseUtilities().pickAvatarByFranchiseId(props.match.params.id);
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
                    franchiseId={props.match.params.id} />
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
      <section>
        <h1>Trades</h1>
        <div className="d-flex flex-wrap justify-content-center">
          {
            franchise.trades?.map((trade: any) => (
              <TradeCard trade={trade} key={trade.tradeId} />
            ))
          }
          <Button onClick={handleClick}>Load More</Button>
        </div>
      </section>

    </Container>
  );
}

export default Franchise;