import { gql } from "@apollo/client";

export const GET_MATCHUPS = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    matches(year: $year, franchiseId: $franchiseId)
    {
      type
      year
      week
      winningFranchiseId
      winningFranchise
      winningTeamPoints
      winningTeamProjectedPoints
      losingFranchiseId
      losingFranchise
      losingFranchisePoints
      losingFranchiseProjectedPoints
      tied
    }
  }
`;