import gql from "graphql-tag";

export const GET_LEAGUE = gql`
  query GibsonsLeagueQuery {
    league {
      leagueId
      name
      startYear
      franchises {
        franchiseId
        mainName
        wins
        loses
        ties
        points
        championships
        teams {
          year
          champion
          secondPlace
        }
      }
    }
  }
`;