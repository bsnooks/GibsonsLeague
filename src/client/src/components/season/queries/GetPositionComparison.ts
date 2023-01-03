import { gql } from "@apollo/client";

export const GET_PLAYER_COMPARISON = gql`
  query GibsonsLeagueQuery($year: Int) {
    season(year: $year) {
      positionComparison {
        position
        primaryPosition
        points
        positionRank
        name
        gamesPlayed
        endfranchise
        endfranchisecolor
      }
    }
  }
`;
