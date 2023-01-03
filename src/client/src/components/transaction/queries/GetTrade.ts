import { gql } from "@apollo/client";

export const GET_TRADE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    trade(id: $id) {
      tradeId
      date
      franchiseId
      franchiseName
      tradedWithFranchiseId
      tradedWithFranchiseName
      tradedfor {
        year
        playerId
        primaryPosition
        positionRank
        name
        tree {
          type
          transactionId
          transactionGroupId
          playerId
          year
          date
          description
          primaryPosition
          positionRank
        }
      }
      tradedaway {
        year
        playerId
        primaryPosition
        positionRank
        name
        tree {
          type
          transactionId
          transactionGroupId
          playerId
          year
          date
          description
          primaryPosition
          positionRank
        }
      }
    }
  }
`;
