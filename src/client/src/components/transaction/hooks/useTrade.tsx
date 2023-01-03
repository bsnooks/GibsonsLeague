import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradeArgs, FranchiseTrade } from "../../../generated/graphql";
import { GET_TRADE } from "../queries";
  
export const useTrade = () => {
  // state
  const [trade, setTrade] = useState<FranchiseTrade>();
  const [selectedTradeId, setSelectedTradeId] = useState<string>();
  
  // hooks
  const history = useHistory();

  // queries
  const [fetchTrade, { data, loading, error }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTradeArgs>(GET_TRADE);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.trade) return;

    setTrade(data.trade);
  }, [data]);

  useEffect(() => {
    if (!selectedTradeId) return;
    fetchTrade({
      variables: {
        id: selectedTradeId,
      }
    });
  }, [fetchTrade, selectedTradeId]);

  useEffect(() => {
    history.listen((location) => {
      const parts = location?.pathname.split("/");
      if (parts.length > 2 && parts[1] === "trade") {
        setSelectedTradeId(parts[2]);
      }
    });
  }, [history]);

  useEffect(() => {
    const parts = history?.location?.pathname.split("/");
      if (parts.length > 2 && parts[1] === "trade") {
        setSelectedTradeId(parts[2]);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    trade,
    loading,
    error
  };
};
