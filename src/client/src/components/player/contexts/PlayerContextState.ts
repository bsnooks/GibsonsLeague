import { ApolloError } from "@apollo/client";
import { Player } from "../../../generated/graphql";

export interface IPlayerContextState {
  player?: Player;

  loading: boolean;
  error?: ApolloError;
}

export type UpdatePlayerState = {
  player: Player;
};

export type UpdateLoadingState = {
  loading: boolean;
};

export type UpdateErrorState = {
  error?: ApolloError;
};