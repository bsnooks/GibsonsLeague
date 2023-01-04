import { ApolloError } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { useFranchiseLoader, useLeagueDispatch, useLeagueLoader, useSeasonLoader } from "../hooks";

export interface LeagueContextLoaderProps {
  children: ReactNode;
}

export default function LeagueContextLoader({
  children
}: LeagueContextLoaderProps): JSX.Element {
  // state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError | undefined>(undefined);
  
  // hooks
  const { loading: leagueLoading, error: leagueError } = useLeagueLoader();
  const { loading: seasonLoading, error: seasonError } = useSeasonLoader();
  const { loading: franchiseLoading, error: franchiseError } = useFranchiseLoader();

  // dispatch
  const leagueDispatch = useLeagueDispatch();

  useEffect(() => {
    setLoading(leagueLoading || seasonLoading || franchiseLoading);
  }, [franchiseLoading, leagueLoading, seasonLoading]);
  
  useEffect(() => {
    setError(leagueError ?? seasonError ?? franchiseError);
  }, [franchiseError, leagueError, seasonError]);

  useEffect(() => {
    leagueDispatch({
      payload: {
        loading: loading
      }
    });
  }, [leagueDispatch, loading]);

  useEffect(() => {
    leagueDispatch({
      payload: {
        error: error
      }
    });
  }, [leagueDispatch, error]);
  
  return (
    <>
      {children}
    </>
  );
};