import WeekPointsGraph from "../../charts/WeekPointsGraph";
import { useMatchups } from "../../matchup/hooks";
import { GlobalLoading, GlobalError } from "../../ui";

interface MatchupAnalysisProps {};

export const MatchupAnalysis: React.FC<MatchupAnalysisProps> = () => {
  // hooks
  const { matchups, loading, error } = useMatchups();

  if (loading) return <GlobalLoading />;
  if (error) return <GlobalError apolloError={error} />;

  return (
    <WeekPointsGraph matches={matchups} />
  );
};