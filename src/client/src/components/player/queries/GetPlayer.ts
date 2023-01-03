import gql from "graphql-tag";

export const GET_PLAYER = gql`
  query GibsonsLeagueQuery($id: Int) {
    player(id: $id) {
      playerId
      name
      position
      points
      pointsPerGame
      pointsPerSeason
      seasonsCount
      gamesPlayed
      gamesStarted
      gamesBenched
      avgPositionRank
      avgPositionRankPpg
      seasons
      {
        year
        position
        gamesPlayed
        gamesStarted
        gamesBenched
        points
        positionRank
        positionRankPpg
        transactions
        {
          type
          transactionId
          transactionGroupId
          date
          description
          franchiseId
          franchiseName
        }
      }
      comparisonSeasons
      {
        year
        points
        gamesPlayed
        positionRank
        name
      }
    }
  }
`;