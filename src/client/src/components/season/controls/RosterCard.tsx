import React from "react";
import { TeamPlayer } from "../../../generated/graphql";

interface RosterCardProps {
  player: TeamPlayer
}

export const RosterCard: React.FC<RosterCardProps> = ({ ...props }) => {

  return (
    <div>{props.player?.player?.name}</div>
  );
};
