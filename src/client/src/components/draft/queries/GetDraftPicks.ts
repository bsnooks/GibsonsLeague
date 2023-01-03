import gql from "graphql-tag";

export const GET_DRAFTPICKS = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    draftpicks(franchiseId: $franchiseId, year: $year) {
      year
      round
      pick
      positionPick
      playerId
      playerName
      playerPosition
      playerPrimaryPosition
      franchiseId
      franchiseName
      playerPositionRank
      playerPositionRankPpg
      gamesPlayed
      points
    }
  }
`;
