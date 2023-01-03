import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs, DraftPick } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_DRAFTPICKS } from "../queries";
  
export const useDraft = () => {
  // state
  const [draftPicks, setDraftPicks] = useState<DraftPick[]>([]);

  // hooks
  const { season, franchise } = useLeagueContext();

  // queries
  const [fetchDraftPicks, { data, loading, error, refetch: refetchDraftPicks }] = useLazyQuery<GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs>(GET_DRAFTPICKS);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.draftpicks) return;

    setDraftPicks(data.draftpicks as DraftPick[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchDraftPicks && (franchise || season)) {
      refetchDraftPicks({
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      });
    }
  }, [franchise, refetchDraftPicks, season]);

  // Component mounting
  useEffect(() => {
    if (!franchise && !season) return;

    fetchDraftPicks({
      variables: {
        franchiseId: franchise?.franchiseId,
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    draftPicks,
    loading,
    error
  };
};
