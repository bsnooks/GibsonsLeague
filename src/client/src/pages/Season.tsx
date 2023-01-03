import React from "react";
import { useLeagueContext } from "../components/league/hooks";
import { Header, RouterSwitch } from "../components/season";
import { GlobalLoading, GlobalError } from "../components/ui";

interface SeasonProps {}

const Season: React.FC<SeasonProps> = () => {
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

export default Season;
