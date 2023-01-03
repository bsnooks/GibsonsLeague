import React, { useEffect } from "react";
import { useLeagueContext } from "../components/league/hooks";
import { useHistory } from "react-router";
import { GlobalLoading, GlobalError } from "../components/ui";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  // hooks
  const { league, season, franchise, loading, error } = useLeagueContext();
  const history = useHistory();

  useEffect(() => {
    if (!league || loading) {
      return;
    } else if (season && franchise) {
      history.push(`/season/${season.year}/t/${franchise.franchiseId}`);
    } else if (season) {
      history.push(`/season/${season.year}`);
    } else if (franchise) {
      history.push(`/franchise/${franchise.franchiseId}`);
    } else {
      history.push("/league");
    }
  }, [franchise, history, league, loading, season]);

  if (loading) return <GlobalLoading mode="page" />;
  if (error) return <GlobalError mode="page" apolloError={error} />;

  return <></>;
};

export default Home;
