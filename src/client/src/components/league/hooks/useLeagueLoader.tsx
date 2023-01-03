import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryLeagueArgs } from "../../../generated/graphql";
import { useLeagueDispatch } from "../hooks";
import { GET_LEAGUE } from "../queries";

  
export const useLeagueLoader = () => {
  // dispatches
  const leagueDispatch = useLeagueDispatch();

  // queries
  const [fetchLeague, { data, loading, error }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryLeagueArgs>(GET_LEAGUE);

  // Update the league when the apollo query successfully finishes
  useEffect(() => {
    if (!data?.league) return;

    leagueDispatch({
      payload: {
        league: data?.league,
      },
    });
  }, [data, leagueDispatch]);

  // Component mounting
  useEffect(() => {
    const sessionLeagueId = sessionStorage.getItem(`leagueId`);
    fetchLeague({
      variables: {
        id: sessionLeagueId,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error
  };
};
