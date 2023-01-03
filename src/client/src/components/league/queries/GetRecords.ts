import gql from "graphql-tag";

export const GET_RECORDS = gql`
query GibsonsLeagueQuery {
  league
  {
    records(number:10, positivity:true)
    {
      recordTitle
      positiveRecord
      type
      top
      {
        rank
        franchiseId
        franchiseName
        otherFranchiseId
        otherFranchiseName
        playerId
        playerName
        playerPosition
        recordValue
        recordNumericValue
        year
        week
      }
    }
  }
}
`;