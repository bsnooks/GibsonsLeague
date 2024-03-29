import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DraftPick, Maybe } from "../../../generated/graphql";
import { DraftPickGrader } from "../../../utilities/DraftPickGrader";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";

interface DraftCardProps {
  grouping: any;
  groupingLink?: string;
  groupingLabel: string;
  includeFranchise?: boolean;
  picks: Maybe<DraftPick>[];
}

export const DraftCard: React.FC<DraftCardProps> = ({ ...props }) => {
  const grader = new DraftPickGrader();
  const avatarPicker = new FranchiseUtilities();

  return (
    <>
      <div className="drafts-list">
        <div className="group">
          <>{props.groupingLabel}</>
        </div>
        <div className="drafts-headings">
          <div className="draft-col pick">Pick</div>
          {props.includeFranchise ? (
            <div className="draft-col player">Franchise</div>
          ) : null}
          <div className="draft-col player">Player</div>
          <div className="draft-col posPick">Position Pick</div>
          <div className="draft-col rank">Position Rank</div>
          <div className="draft-col rankppg">Position Rank (ppg)</div>
          <div className="draft-col games">Games Played</div>
          <div className="draft-col grade">Grade</div>
        </div>
        {props.picks.map((pick: Maybe<DraftPick>) => {
          const grade = grader.gradeDraftPick(pick);
          return (
            <div
              key={pick?.pick}
              className={`draft player-${pick?.playerPrimaryPosition}`}
            >
              <div className="draft-col pick">{pick?.pick}</div>
              {props.includeFranchise ? (
                <div className="draft-col franchise">
                  <Image
                    roundedCircle
                    src={avatarPicker.pickAvatarByFranchiseId(
                      pick?.franchiseId
                    )}
                    style={{ width: "1.5rem", marginRight: "4px" }}
                  />
                  <FranchiseLink franchiseId={pick?.franchiseId}>
                    {pick?.franchiseName}
                  </FranchiseLink>
                </div>
              ) : null}
              <div className="draft-col player">
                <Link to={`/player/${pick?.playerId}`}>{pick?.playerName}</Link>
              </div>
              <div className="draft-col posPick">
                {`${pick?.playerPrimaryPosition}-${pick?.positionPick}`}
              </div>
              <div className="draft-col rank">
                {pick?.playerPositionRank
                  ? `${pick?.playerPrimaryPosition}-${pick?.playerPositionRank}`
                  : ""}
              </div>
              <div className="draft-col rankppg">
                {pick?.playerPositionRankPpg
                  ? `${pick?.playerPrimaryPosition}-${pick?.playerPositionRankPpg}`
                  : ""}
              </div>
              <div className="draft-col games">{pick?.gamesPlayed}</div>
              <div className="draft-col grade">
                {`${grade?.grade ? grade?.grade : ""}${
                  grade?.asterisk ? grade?.asterisk : ""
                }`}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
