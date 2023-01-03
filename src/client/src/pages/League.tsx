import React from "react";
import { Header, RouterSwitch } from "../components/league";
import { useLeagueContext } from "../components/league/hooks";
import { GlobalLoading, GlobalError } from "../components/ui";

interface LeagueProps {}

const League: React.FC<LeagueProps> = () => {
  // hooks
  const { loading, error } = useLeagueContext();
  
  if (loading) return <GlobalLoading mode="page" />;
  if (error) return <GlobalError mode="page" apolloError={error} />;

  return (
    <>
      <Header />
      <RouterSwitch />
    </>
  );
};

export default League;
