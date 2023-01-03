// @ts-nocheck
import React from "react";
import {
  Image,
} from "react-bootstrap";
import styled from "styled-components";
import { Match, Maybe } from "../../../generated/graphql";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";
import { FranchiseLink } from "../../franchise/controls";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SeasonMatchCardProps {
  matches: Maybe<Array<Maybe<Match>>>;
}

export const SeasonMatchCard: React.FC<SeasonMatchCardProps> = ({
  ...props
}) => {
  const franchiseUtilities = new FranchiseUtilities();

  return (
    <>
      {props.matches?.map((match: Maybe<Match>) => {
        const avatarWinner = franchiseUtilities.pickAvatarByFranchiseId(
          match?.winningFranchiseId
        );
        const avatarLoser = franchiseUtilities.pickAvatarByFranchiseId(
          match?.losingFranchiseId
        );

        return (
          <div key={match?.winningFranchise}>
            <MatchTypeWrapper>
              {match?.type === "Playoff" && <><FontAwesomeIcon icon={faTrophy} className="gold" /> Playoff Matchup <FontAwesomeIcon icon={faTrophy} className="gold" /></>}
              {match?.type === "Championship" && <><FontAwesomeIcon icon={faTrophy} className="gold" /> Championship Matchup <FontAwesomeIcon icon={faTrophy} className="gold" /></>}
              {match?.type === "Consolation" && "Consolation Matchup"}
            </MatchTypeWrapper>
            <MatchWrapper>
              <TeamWrapper winner={true}>
                <TeamInfoWrapper>
                  <FranchiseLink franchiseId={match?.winningFranchiseId}>
                    {match?.winningFranchise}
                  </FranchiseLink>
                </TeamInfoWrapper>
                <TeamLogoWrapper>
                  <Image
                    src={avatarWinner}
                    roundedCircle
                    fluid
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </TeamLogoWrapper>
                <TeamScoreWrapper>
                  <TeamScorePoints>{match?.winningTeamPoints.toFixed(2)}</TeamScorePoints>
                  <TeamScoreProjectedPoints>
                    {match?.winningTeamProjectedPoints.toFixed(2)}
                  </TeamScoreProjectedPoints>
                </TeamScoreWrapper>
              </TeamWrapper>
              <TeamDivider>vs</TeamDivider>
              <TeamWrapper>
                <TeamScoreWrapper>
                  <TeamScorePoints>
                    {match?.losingFranchisePoints.toFixed(2)}
                  </TeamScorePoints>
                  <TeamScoreProjectedPoints>
                    {match?.losingFranchiseProjectedPoints.toFixed(2)}
                  </TeamScoreProjectedPoints>
                </TeamScoreWrapper>
                <TeamLogoWrapper>
                  <Image
                    src={avatarLoser}
                    roundedCircle
                    fluid
                    style={{ width: "3rem", height: "3rem" }}
                  />
                </TeamLogoWrapper>
                <TeamInfoWrapper>
                  <FranchiseLink franchiseId={match?.losingFranchiseId}>
                    {match?.losingFranchise}
                  </FranchiseLink>
                </TeamInfoWrapper>
              </TeamWrapper>
            </MatchWrapper>
          </div>
        );
      })}
    </>
  );
};

const MatchWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  grid-gap: 20px;

  padding: 10px;

  background-color: #fff;
  border-bottom: 1px solid #ccc;
`;
const MatchTypeWrapper = styled.div``;
const TeamDivider = styled.div`
  background-color: #ccc;
  border-radius: 50%;
  height: 30px;
  width: 30px;
`;
const TeamInfoWrapper = styled.div``;
const TeamLogoWrapper = styled.div``;
const TeamScorePoints = styled.div`
  font-size: 1.4em;
`;
const TeamScoreProjectedPoints = styled.div`
  font-size: 0.9em;
  font-style: italic;
  color: #aaa;
`;
const TeamScoreWrapper = styled.div``;
const TeamWrapper = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.winner ? "1fr auto auto" : "auto auto 1fr"};
  align-items: center;
  grid-gap: 12px;

  ${TeamInfoWrapper} {
    text-align: ${(props) => (props.winner ? "right" : "left")};
  }
  ${TeamScorePoints} {
    font-weight: ${(props) => (props.winner ? "600" : "auto")};
  }
`;
