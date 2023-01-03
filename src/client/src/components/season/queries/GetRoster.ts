import { gql } from "@apollo/client";

export const GET_ROSTER = gql`
  query GibsonsLeagueQuery($id: Guid, $year: Int) {
    franchise(id: $id) {
      teams(year: $year) {
        players {
          playerId
          player {
            name
            nflTeam
            primaryPosition
          }
          teamPoints
          seasonPoints
          gamesStarted
          gamesBenched
          passYards
          passTDs
          rushYards
          rushTDs
          recYards
          recTDs
          interceptions
          fumblesLost
          twoPointConvert
        }
      }
    }
  }
`;
