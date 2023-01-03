import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SectionInfoBox from '../../controls/SectionInfoBox';
import { usePlayerContext } from '../hooks';

interface PlayerOverviewProps {
  history?: any;
  match: any;
  image?: string | any;
}

const PlayerOverview: React.FC<PlayerOverviewProps> = () => {
 const { player } = usePlayerContext();


  if (!player) return null;

  return (
    <Container>
      <section>
        <Row>
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
                <Col><SectionInfoBox title="Games Started" info={player?.gamesStarted} /></Col>
                <Col><SectionInfoBox title="Games Benched" info={player?.gamesBenched} /></Col>
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
      </section>

    </Container>
  );
}

export default PlayerOverview;