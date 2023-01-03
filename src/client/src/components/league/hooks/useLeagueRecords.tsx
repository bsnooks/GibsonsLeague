import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryLeagueArgs, LeagueRecords } from "../../../generated/graphql";
import { useLeagueContext } from "../hooks";
import { GET_RECORDS } from "../queries";
  
export const useLeagueRecords = () => {
  // state
  const [records, setRecords] = useState<LeagueRecords[]>([]);

  // hooks
  const { league } = useLeagueContext();

  // queries
  const [fetchRecords, { data, loading, error }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryLeagueArgs>(GET_RECORDS);

  // Update the league when the apollo query successfully finishes
  useEffect(() => {
    if (!data?.league?.records) return;

    setRecords(data.league.records as LeagueRecords[]);
  }, [data]);

  // Component mounting
  useEffect(() => {
    if (!league) return;

    fetchRecords({
      variables: {
        id: league.leagueId,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    records,
    loading,
    error
  };
};
