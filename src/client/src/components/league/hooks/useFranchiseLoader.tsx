import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from "../../../generated/graphql";
import { useLeagueContext, useLeagueDispatch } from ".";
import { GET_FRANCHISE } from "../queries";

export const useFranchiseLoader = () => {
  // hooks
  const { franchise, selectedFranchiseId } = useLeagueContext();

  // dispatches
  const leagueDispatch = useLeagueDispatch();

  // queries
  const [fetchFranchise, { data, loading, error }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(GET_FRANCHISE);

  // Update the franchise when the apollo query successfully finishes
  useEffect(() => {
    if (!data?.franchise) return;

    leagueDispatch({
      payload: {
        franchise: data?.franchise,
      },
    });
  }, [data, leagueDispatch]);

  useEffect(() => {
    if (selectedFranchiseId && (!franchise || selectedFranchiseId !== franchise?.franchiseId)) {
      fetchFranchise({
        variables: {
          id: selectedFranchiseId
        }
      });
      sessionStorage.setItem(`selectedFranchiseId`, selectedFranchiseId);
    } else if (!selectedFranchiseId && franchise) {
      // Clear the selected franchise
      leagueDispatch({
        payload: {
          franchise: undefined,
        },
      });
      sessionStorage.removeItem(`selectedFranchiseId`);
    }
  }, [selectedFranchiseId, franchise, fetchFranchise, leagueDispatch]);

  // Component mounting
  useEffect(() => {
    const sessionFranchiseId = sessionStorage.getItem(`selectedFranchiseId`);
    if (sessionFranchiseId) {
      leagueDispatch({
        payload: {
          selectedFranchiseId: sessionFranchiseId,
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
