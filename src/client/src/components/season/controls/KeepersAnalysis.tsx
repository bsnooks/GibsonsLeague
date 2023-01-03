import KeepersGraph from "../../charts/KeepersGraph";
import { useKeepers } from "../../keeper/hooks";
import { GlobalLoading, GlobalError } from "../../ui";

interface KeepersAnalysisProps {};

export const KeepersAnalysis: React.FC<KeepersAnalysisProps> = () => {
  // hooks
  const { keepers, loading, error } = useKeepers();

  if (loading) return <GlobalLoading />;
  if (error) return <GlobalError apolloError={error} />;

  return (
    <KeepersGraph keepers={keepers} groupBy="franchiseName" />
  );
};