import React from "react";
import { useLeagueContext } from "../components/league/hooks";
import { Header, RouterSwitch } from "../components/franchise";
import { GlobalLoading, GlobalError } from "../components/ui";

interface FranchiseProps {}

const Franchise: React.FC<FranchiseProps> = () => {
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

export default Franchise;
