import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SectionInfoBox from "../../controls/SectionInfoBox";
import { Link } from "react-router-dom";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLeagueContext } from "../../league/hooks";
import { SeasonLink } from "../../season/controls";

interface FranchiseProps {}

const Franchise: React.FC<FranchiseProps> = ({ ...props }) => {
  const { franchise } = useLeagueContext();

  if (!franchise) return null;

  const getRange = (array: number[]): string[] => {
    var ranges = [],
      rstart,
      rend;
    for (var i = 0; i < array.length; i++) {
      rstart = array[i];
      rend = rstart;
      while (array[i + 1] - array[i] === 1) {
        rend = array[i + 1]; // increment the index if the numbers sequential
        i++;
      }
      ranges.push(rstart === rend ? rstart + "" : rstart + "-" + rend);
    }
    return ranges;
  };

  return (
    <div className="page">
      <Container>
        <Row>
          <Col sm>
            <div className="section-title">
              <span>Stats</span>
            </div>
            <div className="section-body p-3">
              <Row>
                <Col>
                  <SectionInfoBox
                    title="Points"
                    info={Number(franchise.points ?? 0).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2 }
                    )}
                  />
                </Col>
                <Col>
                  <SectionInfoBox title="Trades" info={franchise.tradeCount} />
                </Col>
              </Row>
            </div>
            <div className="section-title">
              <span>Legends</span>
            </div>
            <div className="section-body p-3">
              <div className="legends-list">
                <div className="legends-headings">
                  <div className="legend-col name">Player</div>
                  <div className="legend-col years">Years</div>
                  <div className="legend-col points">Points</div>
                </div>
                {franchise?.legends?.map((legend, int) => {
                  if (!legend) {
                    return null;
                  }
                  const points = Number(legend?.points ?? 0).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2 }
                  );
                  return (
                    <div key={int} className="legend">
                      <div className="legend-col name">
                        {`#${int + 1}. `}
                        <Link
                          to={`/player/${legend?.player?.playerId}`}
                          title={`${points} points`}
                        >
                          {legend?.player?.name}
                        </Link>
                        <span>{` (${legend?.player?.position})`}</span>
                        <br />
                        <span className="pointstext">{`${points} points (${legend?.gamesPlayed} games)`}</span>
                      </div>
                      <div className="legend-col years">
                        {getRange([...legend.years].sort()).join(", ")}
                      </div>
                      <div className="legend-col points">{points}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>
          <Col sm>
            <div className="section-title">
              <span>Seasons</span>
            </div>
            <div className="section-body p-3">
              <div className="seasons-list">
                <div className="seasons-headings">
                  <div className="season-col year">Year</div>
                  <div className="season-col record">Record</div>
                  <div className="season-col standing">Standing</div>
                  <div className="season-col points">Points</div>
                  <div className="season-col owner">Owner</div>
                </div>
                {franchise.teams
                  ?.filter((t) => t?.standing !== 0)
                  .map((team: any) => (
                    <div key={team.year} className="season">
                      <div className="season-col year">
                        <SeasonLink year={team.year}>
                          {team?.year}
                        </SeasonLink>
                      </div>
                      <div className="season-col record">
                        {team.wins}-{team.loses}-{team.ties}
                      </div>
                      <div className="season-col standing">
                        {`${team.standing}${
                          team.champion || team.secondPlace ? "-" : ""
                        }`}
                        {team.champion ? (
                          <FontAwesomeIcon icon={faTrophy} className="gold" />
                        ) : null}
                        {team.secondPlace ? (
                          <FontAwesomeIcon icon={faTrophy} className="silver" />
                        ) : null}
                      </div>
                      <div className="season-col points">
                        {Number(team.points ?? 0).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="season-col owner">{team.owner}</div>
                    </div>
                  ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Franchise;
