import React from 'react';
import { Container, Jumbotron, Row, Col } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import GlobalError from '../components/GlobalError';
import PlayerSeasonCard from '../components/cards/PlayerSeasonCard';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Int) {
    player(id: $id) {
      name
      position
      points
      pointsPerGame
      pointsPerSeason
      seasonsCount
      gamesPlayed
      avgPositionRank
      avgPositionRankPpg
      seasons
      {
        year
        position
        gamesPlayed
        points
        positionRank
        positionRankPpg
        transactions
        {
          type
          transactionId
          transactionGroupId
          date
          description
        }
      }
    }
  }
`;

interface PlayerProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Player: React.FC<PlayerProps> = ({ ...props }) => {

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    { variables: { id: props.match.params.id } }
  );

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.player) return <p>Not Found</p>;

  const player = data.player;

  return (
    <Container>
      <Jumbotron fluid>
        <h1>{player.name} ({player.position})</h1>
        <Row>
          <Col>Seasons: {player?.seasonsCount}</Col>
          <Col>Games Played: {player?.gamesPlayed}</Col>
          <Col>Average Position Rank: {Number(player?.avgPositionRank ?? 0).toLocaleString('en-US', { maximumFractionDigits: 1 })}</Col>
          <Col>Average Position Rank (ppg): {Number(player?.avgPositionRankPpg ?? 0).toLocaleString('en-US', { maximumFractionDigits: 1 })}</Col>
        </Row>
        <Row>
          <Col>Points: {Number(player?.points ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
          <Col>Points per Season: {Number(player?.pointsPerSeason ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
          <Col>Points per Game: {Number(player?.pointsPerGame ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Col>
          <Col></Col>
        </Row>
      </Jumbotron>
      <section>
        <h1>Transactions</h1>
        <div className="d-flex flex-wrap justify-content-center">
          <Container>
            {
              player.seasons?.map((playerSeason) => {
                return <PlayerSeasonCard key={playerSeason?.year} playerSeason={playerSeason} />
              })
            }
          </Container>
        </div>
      </section>

    </Container>
  );
}

export default Player;