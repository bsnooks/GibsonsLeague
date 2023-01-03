import gql from "graphql-tag";

export const GET_SEASON = gql`
  query GibsonsLeagueQuery($year: Int) {
    season(year: $year) {
      year
      yahooGameId
      finished
      teams {
        franchiseId
        franchiseName
        wins
        loses
        ties
        champion
        secondPlace
        standing
        points
      }
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
