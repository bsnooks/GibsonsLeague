import produce from "immer";
import React, { ReactNode, useReducer } from "react";
import LeagueContextLoader from "./LeagueContextLoader";
import {
  ILeagueContextState,
  UpdateErrorState,
  UpdateLeagueState,
  UpdateLoadingState,
  UpdateFranchiseState,
  UpdateSeasonState,
  SetSelectedYear,
  SetSelectedFranchiseId
} from "./LeagueContextState";

export const initialLeagueContextState: ILeagueContextState = {
  loading: false,
};
export const LeagueContext = React.createContext(initialLeagueContextState);

export interface Action<T, Type> {
  type?: Type;
  payload: T;
}
export const LeagueDispatchContext = React.createContext<
  React.Dispatch<Action<LeagueUpdates, "update">>
>(() => {
  throw new Error("unimplemented");
});

export type LeagueUpdates =
  | UpdateErrorState
  | UpdateLeagueState
  | UpdateLoadingState
  | UpdateFranchiseState
  | UpdateSeasonState
  | SetSelectedYear
  | SetSelectedFranchiseId;

function LeagueReducer(
  state: ILeagueContextState,
  action: Action<LeagueUpdates, "update">
) {
  return produce(state, (draft) => {
    Object.assign(draft, action.payload);
  });
}

export interface LeagueProviderModel {
  children: ReactNode;
  state?: ILeagueContextState;
}

export function LeagueProvider({
  children,
  state: overrideState,
}: LeagueProviderModel) {
  const [state, dispatch] = useReducer(
    LeagueReducer,
    overrideState ?? initialLeagueContextState
  );

  return (
    <LeagueContext.Provider value={state}>
      <LeagueDispatchContext.Provider value={dispatch}>
        <LeagueContextLoader>
          {children}
        </LeagueContextLoader>
      </LeagueDispatchContext.Provider>
    </LeagueContext.Provider>
  );
}
