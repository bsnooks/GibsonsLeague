import { League } from "../../../generated/graphql";

export interface ILeagueContextState {
    league?: League;
};

export type UpdateLeagueState = {
    league: League;
};