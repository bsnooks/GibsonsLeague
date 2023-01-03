import React from "react";
import { Image } from "react-bootstrap";
import { Franchise } from "../../../generated/graphql";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";
import { SeasonLink } from "../../season/controls";

interface ChampionRowProps {
  year: number;
  winner: Franchise;
  second: Franchise;
}

export const ChampionRow: React.FC<ChampionRowProps> = ({ ...props }) => {
  const winnerAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(
    props.winner.franchiseId
  );
  const secondAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(
    props.second.franchiseId
  );

  return (
    <div className="champion">
      <div className="champion-col year">
        <SeasonLink year={props.year}>{props.year}</SeasonLink>
      </div>
      <div className="champion-col team">
        <Image roundedCircle src={winnerAvatar} style={{ width: "1.5rem" }} />
        <FranchiseLink
          franchiseId={props.winner.franchiseId}
          style={{ paddingLeft: "10px" }}
        >
          {props.winner.mainName}
        </FranchiseLink>
      </div>
      <div className="champion-col second">
        <Image roundedCircle src={secondAvatar} style={{ width: "1.5rem" }} />
        <FranchiseLink
          franchiseId={props.second.franchiseId}
          style={{ paddingLeft: "10px" }}
        >
          {props.second.mainName}
        </FranchiseLink>
      </div>
    </div>
  );
};
