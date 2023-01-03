import gql from "graphql-tag";

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    franchise(id: $id) {
      franchiseId
      mainName
      wins
      loses
      ties
      championships
      runnerUps
      points
      tradeCount
      teams
      {
        year
        owner
        standing
        champion
        secondPlace
        wins
        loses
        ties
        points
      }
      legends
      {
        points
        gamesPlayed
        years
        player
        {
          playerId
          name
          position
        }
      }
    }
  }
`;