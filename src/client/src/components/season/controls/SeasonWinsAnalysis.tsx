import SeasonGraph from "../../charts/SeasonGraph";
import { useMatchups } from "../../matchup/hooks";
import { GlobalLoading, GlobalError } from "../../ui";

interface SeasonWinsAnalysisProps {};

export const SeasonWinsAnalysis: React.FC<SeasonWinsAnalysisProps> = () => {
  // hooks
  const { matchups, loading, error } = useMatchups();

  if (loading) return <GlobalLoading />;
  if (error) return <GlobalError apolloError={error} />;

  return (
    <SeasonGraph matches={matchups} />
  );
};