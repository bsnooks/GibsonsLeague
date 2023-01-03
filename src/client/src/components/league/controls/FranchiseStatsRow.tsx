import React from "react";
import { Image } from "react-bootstrap";
import { Franchise } from "../../../generated/graphql";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";

interface FranchiseStatsRowProps {
  franchise: Franchise;
}

export const FranchiseStatsRow: React.FC<FranchiseStatsRowProps> = ({
  ...props
}) => {
  const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(
    props.franchise.franchiseId
  );

  const franchise = props.franchise;

  return (
    <div className="franchise">
      <div className="franchise-col team">
        <Image roundedCircle src={avatar} style={{ width: "1.5rem" }} />
        <FranchiseLink franchiseId={props.franchise.franchiseId} style={{paddingLeft:"10px"}}>
          {props.franchise.mainName}
        </FranchiseLink>
      </div>
      <div className="franchise-col record">
        {`${franchise?.wins}-${franchise?.loses}-${franchise?.ties}`}
      </div>
      <div className="franchise-col points">
        {Number(franchise.points ?? 0).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </div>
      <div className="franchise-col championships">
        {props.franchise.championships}
      </div>
    </div>
  );
};
