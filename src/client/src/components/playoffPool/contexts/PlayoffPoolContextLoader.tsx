import { ApolloError } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { usePlayoffPoolDispatch, usePlayoffPoolLoader } from "../hooks";

export interface PlayoffPoolContextLoaderProps {
  children: ReactNode;
}

export default function PlayoffPoolContextLoader({
  children
}: PlayoffPoolContextLoaderProps): JSX.Element {
  // state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError | undefined>(undefined);

  // hooks
  const { loading: playoffPoolLoading, error: playoffPoolError } = usePlayoffPoolLoader();

  // dispatch
  const PlayoffPoolDispatch = usePlayoffPoolDispatch();

  useEffect(() => {
    setLoading(playoffPoolLoading);
  }, [playoffPoolLoading]);
  
  useEffect(() => {
    setError(playoffPoolError ?? undefined);
  }, [playoffPoolError]);

  useEffect(() => {
    PlayoffPoolDispatch({
      payload: {
        loading: loading
      }
    });
  }, [PlayoffPoolDispatch, loading]);

  useEffect(() => {
    PlayoffPoolDispatch({
      payload: {
        error: error
      }
    });
  }, [PlayoffPoolDispatch, error]);
  
  return (
    <>
      {children}
    </>
  );
};