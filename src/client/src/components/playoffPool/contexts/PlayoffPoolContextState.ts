import { ApolloError } from "@apollo/client";
import { PlayoffPool } from "../models/PlayoffPool";

export interface IPlayoffPoolContextState {
  pool?: PlayoffPool;

  loading: boolean;
  error?: ApolloError;
}

export type UpdatePlayoffPoolState = {
  pool: PlayoffPool;
};

export type UpdateLoadingState = {
  loading: boolean;
};

export type UpdateErrorState = {
  error?: ApolloError;
};