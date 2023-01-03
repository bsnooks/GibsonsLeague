import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { FranchiseStatsRow, ChampionsCard } from "../controls";
import { useLeagueContext } from "../hooks";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";

interface LeagueHistoryProps {}

const LeagueHistory: React.FC<LeagueHistoryProps> = () => {
  // hooks
  const { league } = useLeagueContext();

  const currentChamp = league?.franchises?.filter(
    (f) => f?.franchiseId === "bbe2d0ad-54cf-4c22-be82-b2a5f262a157"
  )[0];
  const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
    currentChamp?.franchiseId
  );

  return (
    <Container>
      <Row>
        <Col sm>
          <div className="section-title">
            <span>Current Champion</span>
          </div>
          <div className="section-body p-3">
            <Image rounded src={avatar} style={{ width: "10rem" }} />
            <br />
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
              {league?.franchises
                ?.slice()
                .sort((a, b) => ((a?.wins ?? 0) > (b?.wins ?? 0) ? -1 : 1))
                .map((franchise: any) => (
                  <FranchiseStatsRow
                    key={franchise.franchiseId}
                    franchise={franchise}
                  />
                ))}
            </div>
          </div>
        </Col>
        <Col sm>
          <div className="section-title">
            <span>Champions</span>
          </div>
          <div className="section-body p-3">
            {league?.franchises ? (
              <ChampionsCard franchises={league?.franchises} />
            ) : null}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LeagueHistory;
