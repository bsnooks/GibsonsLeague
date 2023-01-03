import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs, FranchiseTrade } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_TRADES } from "../queries";
  
export const useTrades = () => {
  // state
  const [trades, setTrades] = useState<FranchiseTrade[]>();
  
  // hooks
  const { season, franchise } = useLeagueContext();

  // queries
  const [fetchTrades, { data, loading, error, refetch: refetchTrades }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs>(GET_TRADES);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.trades) return;

    setTrades(data.trades as FranchiseTrade[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchTrades && (franchise || season)) {
      refetchTrades({
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      });
    }
  }, [franchise, refetchTrades, season]);

  // Component mounting
  useEffect(() => {
    if (!franchise && !season) return;

    fetchTrades({
      variables: {
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    trades,
    loading,
    error
  };
};
