import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQuerySeasonArgs } from "../../../generated/graphql";
import { useLeagueContext, useLeagueDispatch } from ".";
import { GET_SEASON } from "../queries";

export const useSeasonLoader = () => {
  // hooks
  const { season, selectedYear } = useLeagueContext();

  // dispatches
  const leagueDispatch = useLeagueDispatch();

  // queries
  const [fetchSeason, { data, loading, error }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQuerySeasonArgs>(GET_SEASON);

  // Update the season when the apollo query successfully finishes
  useEffect(() => {
    if (!data?.season) return;

    leagueDispatch({
      payload: {
        season: data?.season,
      },
    });
  }, [data, leagueDispatch]);

  useEffect(() => {
    if (selectedYear && (!season || selectedYear !== season?.year)) {
      fetchSeason({
        variables: {
          year: selectedYear
        }
      });
      sessionStorage.setItem(`selectedYear`, `${selectedYear}`);
    } else if (!selectedYear && season) {
      // Clear the selected season
      leagueDispatch({
        payload: {
          season: undefined,
        },
      });
      sessionStorage.removeItem(`selectedYear`);
    }
  }, [selectedYear, season, fetchSeason, leagueDispatch]);

  // Component mounting
  useEffect(() => {
    const sessionYear = sessionStorage.getItem(`selectedYear`);
    if (sessionYear) {
      leagueDispatch({
        payload: {
          selectedYear: parseInt(sessionYear),
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error
  };
};
