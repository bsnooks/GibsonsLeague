import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, PlayerWeek } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_PLAYER_GAMES } from "../queries";
import { usePlayerContext } from "./usePlayerContext";
  
export const usePlayerGames = () => {
  // state
  const [games, setGames] = useState<PlayerWeek[]>();

  // hooks
  const { player } = usePlayerContext();
  const { season } = useLeagueContext();
  
  // queries
  const [fetchGames, { data, loading, error, refetch: refetchGames }] = useLazyQuery<GibsonsLeagueQuery>(GET_PLAYER_GAMES);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.player?.games) return;

    setGames(data.player?.games as PlayerWeek[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchGames && player) {
      refetchGames({
        id: player.playerId,
        year: season?.year
      });
    }
  }, [player, refetchGames, season?.year]);

  // Component mounting
  useEffect(() => {
    if (!player) return;

    fetchGames({
      variables: {
        id: player.playerId,
        year: season?.year
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    games,
    loading,
    error
  };
};
