import { useLeagueContext } from "../league/hooks";

interface TeamProps { }

export const Team: React.FC<TeamProps> = () => {
  const { season, franchise } = useLeagueContext();

  if (!season || !franchise) {
    return null;
  }

  return <>{franchise.mainName}</>;
}