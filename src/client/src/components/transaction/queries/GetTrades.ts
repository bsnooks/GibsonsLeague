import { gql } from "@apollo/client";

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    trades(franchiseId: $franchiseId, year: $year) {
      tradeId
      date
      franchiseId
      franchiseName
      tradedWithFranchiseId
      tradedWithFranchiseName
      tradedfor {
        playerId
        position
        name
      }
      tradedaway {
        playerId
        position
        name
      }
    }
  }
`;
