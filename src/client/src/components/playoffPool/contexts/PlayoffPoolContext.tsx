import produce from "immer";
import React, { ReactNode, useReducer } from "react";
import PlayoffPoolContextLoader from "./PlayoffPoolContextLoader";
import {
  IPlayoffPoolContextState,
  UpdatePlayoffPoolState,
  UpdateLoadingState,
  UpdateErrorState
} from "./PlayoffPoolContextState";

export const initialPlayoffPoolContextState: IPlayoffPoolContextState = {
  loading: false,
};
export const PlayoffPoolContext = React.createContext(initialPlayoffPoolContextState);

export interface Action<T, Type> {
  type?: Type;
  payload: T;
}
export const PlayoffPoolDispatchContext = React.createContext<
  React.Dispatch<Action<PlayoffPoolUpdates, "update">>
>(() => {
  throw new Error("unimplemented");
});

export type PlayoffPoolUpdates =
  | UpdatePlayoffPoolState
  | UpdateLoadingState
  | UpdateErrorState;

function PlayoffPoolReducer(
  state: IPlayoffPoolContextState,
  action: Action<PlayoffPoolUpdates, "update">
) {
  return produce(state, (draft) => {
    Object.assign(draft, action.payload);
  });
}

export interface PlayoffPoolProviderModel {
  children: ReactNode;
  state?: IPlayoffPoolContextState;
}

export function PlayoffPoolProvider({
  children,
  state: overrideState,
}: PlayoffPoolProviderModel) {
  const [state, dispatch] = useReducer(
    PlayoffPoolReducer,
    overrideState ?? initialPlayoffPoolContextState
  );

  return (
    <PlayoffPoolContext.Provider value={state}>
      <PlayoffPoolDispatchContext.Provider value={dispatch}>
        <PlayoffPoolContextLoader>
          {children}
        </PlayoffPoolContextLoader>
      </PlayoffPoolDispatchContext.Provider>
    </PlayoffPoolContext.Provider>
  );
}
