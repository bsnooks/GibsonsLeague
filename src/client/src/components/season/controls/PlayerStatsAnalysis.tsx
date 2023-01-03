import SeasonPositionPoints from "../../charts/SeasonPositionPoints";
import { GlobalLoading, GlobalError } from "../../ui";
import { usePlayerComparison } from "../hooks";

interface PlayerStatsAnalysisProps {};

export const PlayerStatsAnalysis: React.FC<PlayerStatsAnalysisProps> = () => {
  // hooks
  const { players, loading, error } = usePlayerComparison();

  if (loading) return <GlobalLoading />;
  if (error) return <GlobalError apolloError={error} />;

  return (
    <SeasonPositionPoints comparisonSeasons={players} usePpg={false} />
  );
};