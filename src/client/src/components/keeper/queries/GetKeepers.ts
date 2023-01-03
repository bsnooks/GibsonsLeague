import gql from "graphql-tag";

export const GET_KEEPERS = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    transactions(franchiseId: $franchiseId, year: $year, type: KEPT) {
      transactionId
      franchiseId
      franchiseName
      playerId
      name
      position
      primaryPosition
      year
      positionRank
      positionRankPpg
      seasonPoints
      seasonGamesPlayed
    }
  }
`;
