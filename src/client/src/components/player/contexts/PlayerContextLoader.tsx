import { ApolloError } from "@apollo/client";
import { ReactNode, useEffect, useState } from "react";
import { usePlayerDispatch, usePlayerLoader } from "../hooks";

export interface PlayerContextLoaderProps {
  children: ReactNode;
}

export default function PlayerContextLoader({
  children
}: PlayerContextLoaderProps): JSX.Element {
  // state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApolloError | undefined>(undefined);

  // hooks
  const { loading: playerLoading, error: playerError } = usePlayerLoader();

  // dispatch
  const playerDispatch = usePlayerDispatch();

  useEffect(() => {
    setLoading(playerLoading);
  }, [playerLoading]);
  
  useEffect(() => {
    setError(playerError);
  }, [playerError]);

  useEffect(() => {
    playerDispatch({
      payload: {
        loading: loading
      }
    });
  }, [playerDispatch, loading]);

  useEffect(() => {
    playerDispatch({
      payload: {
        error: error
      }
    });
  }, [playerDispatch, error]);
  
  return (
    <>
      {children}
    </>
  );
};