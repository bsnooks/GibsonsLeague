import { ApolloError } from "@apollo/client";
import { Franchise, League, Season } from "../../../generated/graphql";

export interface ILeagueContextState {
  league?: League;
  season?: Season;
  franchise?: Franchise;

  selectedYear?: number;
  selectedFranchiseId?: string;

  loading: boolean;
  error?: ApolloError;
}

export type UpdateLeagueState = {
  league: League;
};

export type UpdateFranchiseState = {
  season?: Season;
};

export type UpdateSeasonState = {
  franchise?: Franchise;
};

export type SetSelectedYear = {
  selectedYear?: number;
};

export type SetSelectedFranchiseId = {
  selectedFranchiseId?: string;
};

export type UpdateLoadingState = {
  loading: boolean;
};

export type UpdateErrorState = {
  error?: ApolloError;
};
