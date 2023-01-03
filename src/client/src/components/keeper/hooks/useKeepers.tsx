import {  useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs, PlayerTransaction } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_KEEPERS } from "../queries";
  
export const useKeepers = () => {
  // state
  const [keepers, setKeepers] = useState<PlayerTransaction[]>([]);

  // hooks
  const { season, franchise } = useLeagueContext();

  // queries
  const [fetchKeepers, { data, loading, error, refetch: refetchKeepers }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs>(GET_KEEPERS);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.transactions) return;

    setKeepers(data.transactions as PlayerTransaction[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchKeepers && (franchise || season)) {
      refetchKeepers({
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      });
    }
  }, [franchise, refetchKeepers, season]);

  // Component mounting
  useEffect(() => {
    if (!franchise && !season) return;

    fetchKeepers({
      variables: {
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    keepers,
    loading,
    error
  };
};
