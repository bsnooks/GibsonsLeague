import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryMatchesArgs, Match } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_MATCHUPS } from "../queries";
  
export const useMatchups = () => {
  // state
  const [matchups, setMatchups] = useState<Match[]>([]);

  // hooks
  const { season, franchise } = useLeagueContext();

  // queries
  const [fetchMatchups, { data, loading, error, refetch: refetchMatchups }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryMatchesArgs>(GET_MATCHUPS);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.matches) return;

    setMatchups(data.matches as Match[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchMatchups && (franchise || season)) {
      refetchMatchups({
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      });
    }
  }, [franchise, refetchMatchups, season]);

  // Component mounting
  useEffect(() => {
    if (!franchise && !season) return;

    fetchMatchups({
      variables: {
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    matchups,
    loading,
    error
  };
};
