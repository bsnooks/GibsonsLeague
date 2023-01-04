import React, { useState } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import PlayerGraph from '../../charts/PlayerGraph';
import PlayerPointsGraph from '../../charts/PlayerPointsGraph';
import Switch from "react-switch";
import PlayerSearch from '../../controls/PlayerSearch';
import { usePlayerContext } from '../hooks';

interface PlayerAnalyzeProps {
  history?: any;
  match: any;
  image?: string | any;
}

const PlayerAnalyze: React.FC<PlayerAnalyzeProps> = ({ ...props }) => {
  const [usePpg, setUsePpg] = useState(false);
  const [showGamesPlayed, setShowGamesPlayed] = useState(false);
  const [, setCompareWithId] = useState();
  const [compareWith, ] = useState<any | null>(null);

  const handleChangeUsePpg = (checked: boolean) => {
    setUsePpg(checked);
  };
  const handleChangeGamesPlayed = (checked: boolean) => {
    setShowGamesPlayed(checked);
  };
  
 const { player } = usePlayerContext();

  const handleSelection = (selection: any) => {

    if (selection && selection.length > 0) {
      setCompareWithId(selection[0].playerId);
    }
  };

  if (!player) return null;

  return (
    <Container>
      <section>
        <Row>
          <Col sm>
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
      </section>

    </Container>
  );
}

export default PlayerAnalyze;