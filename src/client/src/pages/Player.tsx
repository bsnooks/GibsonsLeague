import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import GlobalError from '../components/GlobalError';
import PlayerSeasonCard from '../components/cards/PlayerSeasonCard';
import PlayerGraph from '../components/charts/PlayerGraph';
import SectionInfoBox from '../components/controls/SectionInfoBox';
import PlayerPointsGraph from '../components/charts/PlayerPointsGraph';
import Switch from "react-switch";
import PlayerSearch from '../components/controls/PlayerSearch';

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
          franchiseId
          franchiseName
        }
      }
      comparisonSeasons
      {
        year
        points
        gamesPlayed
        positionRank
        name
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
  const [usePpg, setUsePpg] = useState(false);
  const [showGamesPlayed, setShowGamesPlayed] = useState(false);
  const [compareWithId, setCompareWithId] = useState();
  const [compareWith, setCompareWith] = useState<any | null>(null);

  const handleChangeUsePpg = (checked: boolean) => {
    setUsePpg(checked);
  };
  const handleChangeGamesPlayed = (checked: boolean) => {
    setShowGamesPlayed(checked);
  };
  
  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    { variables: { id: props.match.params.id } }
  );


  const result = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    { variables: { id: compareWithId } }
  );

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.player) return <p>Not Found</p>;

  if (!result.loading && !result.error && result.data && result.data.player && compareWith !== result.data.player) {
    setCompareWith(result.data.player);
  }

  const player = data.player;

  const handleSelection = (selection: any) => {

    if (selection && selection.length > 0) {
      setCompareWithId(selection[0].playerId);
    }
  };

  return (
    <Container>
      <section>
        <Row>
          <Col sm>
            <div className="section-title">
              <span>Player Info</span>
            </div>
            <div className="section-body p-3">
              <h1>{player.name} ({player.position})</h1>
            </div>
            <div className="section-title">
              <span>Analyze</span>
            </div>
            <div className="section-body p-3 text-left">
              <Row>
                <Col sm>
                  <div className="section-info-box">
                    <div className="title-container">
                      <div className="title">Use Points Per Game</div>
                    </div>
                    <div className="info-container">
                      <div className="info">
                        <Switch onChange={handleChangeUsePpg} checked={usePpg} />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col sm>
                  <div className="section-info-box">
                    <div className="title-container">
                      <div className="title">Include Games Played</div>
                    </div>
                    <div className="info-container">
                      <div className="info">
                        <Switch onChange={handleChangeGamesPlayed} checked={showGamesPlayed} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm>
                  <div className="section-info-box">
                    <div className="title-container">
                      <div className="title">Compare With</div>
                    </div>
                    <div className="info-container">
                      <div className="info">
                        <PlayerSearch handleSelection={handleSelection} position={player.position} />
                        {compareWith ? <Badge variant="dark" className={`my-2`}>{compareWith.name}</Badge> : null}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col sm>
            <div className="section-title">
              <span>Player Stats</span>
            </div>
            <div className="section-body p-3">
              <Row>
                <Col><SectionInfoBox title="Seasons" info={player?.seasonsCount} /></Col>
                <Col><SectionInfoBox title="Games Played" info={player?.gamesPlayed} /></Col>
              </Row>
              <Row>
                <Col><SectionInfoBox title="Average Position Rank" info={Number(player?.avgPositionRank ?? 0).toLocaleString('en-US', { maximumFractionDigits: 1 })} /></Col>
                <Col><SectionInfoBox title="Average Position Rank (ppg)" info={Number(player?.avgPositionRankPpg ?? 0).toLocaleString('en-US', { maximumFractionDigits: 1 })} /></Col>
              </Row>
              <Row>
                <Col><SectionInfoBox title="Points" info={Number(player?.points ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></Col>
                <Col></Col>
              </Row>
              <Row>
                <Col><SectionInfoBox title="Points per Season" info={Number(player?.pointsPerSeason ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></Col>
                <Col><SectionInfoBox title="Points per Game" info={Number(player?.pointsPerGame ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} /></Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm>
            <div className="section-title">
              <span>Points per Season</span>
            </div>
            <div className="section-body">
              <PlayerPointsGraph seasons={player.seasons} comparisonSeasons={player.comparisonSeasons} position={player.position} compareWith={compareWith} usePpg={usePpg} />
            </div>
          </Col>
          <Col sm>
            <div className="section-title">
              <span>Rank per Season</span>
            </div>
            <div className="section-body">
              <PlayerGraph seasons={player.seasons} position={player.position} compareWith={compareWith} usePpg={usePpg} showGamesPlayed={showGamesPlayed} />
            </div>
          </Col>
        </Row>
        <div className="section-title">
          <span>Transactions</span>
        </div>
        <div className="section-body p-3">
          {
            player.seasons?.map((playerSeason) => {
              return <PlayerSeasonCard key={playerSeason?.year} playerSeason={playerSeason} />
            })
          }
        </div>
      </section>

    </Container>
  );
}

export default Player;