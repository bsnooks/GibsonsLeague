import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GibsonsLeagueQuery,
  GibsonsLeagueQueryPlayerArgs,
} from "../../../generated/graphql";
import { usePlayerDispatch } from ".";
import { GET_PLAYER } from "../queries";
import { useHistory } from "react-router";

export const usePlayerLoader = () => {
  // state
  const [selectedPlayer, setSelectedPlayer] = useState<number | undefined>();
  // hooks
  const history = useHistory();

  // dispatches
  const leagueDispatch = usePlayerDispatch();

  // queries
  const [fetchPlayer, { data, loading, error }] =
    useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryPlayerArgs>(GET_PLAYER);

  // Update the league when the apollo query successfully finishes
  useEffect(() => {
    if (!data?.player) return;

    leagueDispatch({
      payload: {
        player: data?.player,
      },
    });
  }, [data, leagueDispatch]);

  useEffect(() => {
    fetchPlayer({
      variables: {
        id: selectedPlayer,
      }
    });
  }, [fetchPlayer, selectedPlayer]);

  useEffect(() => {
    history.listen((location) => {
      const parts = location?.pathname.split("/");
      if (parts.length > 2 && parts[1] === "player") {
        setSelectedPlayer(parseInt(parts[2]));
      }
    });
  }, [history]);

  useEffect(() => {
    const parts = history?.location?.pathname.split("/");
      if (parts.length > 2 && parts[1] === "player") {
        setSelectedPlayer(parseInt(parts[2]));
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
  };
};
