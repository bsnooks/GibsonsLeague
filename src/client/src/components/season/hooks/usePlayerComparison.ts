import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryMatchesArgs, PlayerSeason } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_PLAYER_COMPARISON } from "../queries";
  
export const usePlayerComparison = () => {
  // state
  const [players, setPlayers] = useState<PlayerSeason[]>([]);

  // hooks
  const { season } = useLeagueContext();

  // queries
  const [fetchMatchups, { data, loading, error, refetch: refetchMatchups }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryMatchesArgs>(GET_PLAYER_COMPARISON);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.season?.positionComparison) return;

    setPlayers(data.season?.positionComparison as PlayerSeason[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchMatchups && season) {
      refetchMatchups({
        year: season?.year,
      });
    }
  }, [ refetchMatchups, season]);

  // Component mounting
  useEffect(() => {
    if (!season) return;

    fetchMatchups({
      variables: {
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    players,
    loading,
    error
  };
};
