import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GibsonsLeagueQuery, TeamPlayer } from "../../../generated/graphql";
import { useLeagueContext } from "../../league/hooks";
import { GET_TEAM_STATS } from "../queries";
  
export const useTeamStats = () => {
  // state
  const [roster, setRoster] = useState<TeamPlayer[]>([]);

  // hooks
  const { season, franchise } = useLeagueContext();

  // queries
  const [fetchRoster, { data, loading, error, refetch: refetchRoster }] = useLazyQuery<GibsonsLeagueQuery>(GET_TEAM_STATS);

  // Handle the query finishing
  useEffect(() => {
    if (!data?.franchise?.teams || !data?.franchise?.teams[0] || !data?.franchise?.teams[0].players) return;

    setRoster(data.franchise.teams[0].players as TeamPlayer[]);
  }, [data]);

  // Handle franchise or season changing.
  useEffect(() => {
    if (refetchRoster && season && franchise) {
      refetchRoster({
        id: franchise?.franchiseId,
        year: season?.year,
      });
    }
  }, [ refetchRoster, season, franchise]);

  // Component mounting
  useEffect(() => {
    if (!season || !franchise) return;

    fetchRoster({
      variables: {
        id: franchise?.franchiseId,
        year: season?.year,
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    roster,
    loading,
    error
  };
};
