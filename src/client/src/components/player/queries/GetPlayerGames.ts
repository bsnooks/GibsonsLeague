import gql from "graphql-tag";

export const GET_PLAYER_GAMES = gql`
  query GibsonsLeagueQuery($id: Int, $year: Int) {
    player(id: $id) {
      playerId
      games(year: $year) {
        year
        week
        points
        passYards
        passTDs
        rushYards
        rushTDs
        recYards
        recTDs
        interceptions
        fumblesLost
        twoPointConvert
        franchiseId
        franchiseName
        started
      }
    }
  }
`;
