import { useEffect } from "react";
import { useQuery } from "react-query";
import { usePlayoffPoolDispatch } from ".";
import { PlayoffPool } from "../models/PlayoffPool";
import { ApolloError } from "@apollo/client";
import { PlayoffPool2023 } from "../data/2023";


export const usePlayoffPoolLoader = () => {
  // dispatches
  const playoffPoolDispatch = usePlayoffPoolDispatch();

  const { data, isLoading, error } = useQuery<PlayoffPool, ApolloError>("getPlayoffPool", async () => {
    return PlayoffPool2023;
  });

  // Update the league when the apollo query successfully finishes
  useEffect(() => {
    if (!data) return;

    const pool = {
      teams: data.teams.sort((a,b) => ((a?.points ?? 0) > (b?.points ?? 0)) ? -1 : 1),
      players: data.players.sort((a,b) => ((a?.pick ?? 0) < (b?.pick ?? 0)) ? -1 : 1)
    }

    playoffPoolDispatch({
      payload: {
        pool,
      },
    });
  }, [data, playoffPoolDispatch]);

  return {
    loading: isLoading,
    error,
  };
};
