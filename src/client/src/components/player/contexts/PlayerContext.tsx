import produce from "immer";
import React, { ReactNode, useReducer } from "react";
import PlayerContextLoader from "./PlayerContextLoader";
import {
  IPlayerContextState,
  UpdatePlayerState,
  UpdateLoadingState,
  UpdateErrorState
} from "./PlayerContextState";

export const initialPlayerContextState: IPlayerContextState = {
  loading: false,
};
export const PlayerContext = React.createContext(initialPlayerContextState);

export interface Action<T, Type> {
  type?: Type;
  payload: T;
}
export const PlayerDispatchContext = React.createContext<
  React.Dispatch<Action<PlayerUpdates, "update">>
>(() => {
  throw new Error("unimplemented");
});

export type PlayerUpdates =
  | UpdatePlayerState
  | UpdateLoadingState
  | UpdateErrorState;

function PlayerReducer(
  state: IPlayerContextState,
  action: Action<PlayerUpdates, "update">
) {
  return produce(state, (draft) => {
    Object.assign(draft, action.payload);
  });
}

export interface PlayerProviderModel {
  children: ReactNode;
  state?: IPlayerContextState;
}

export function PlayerProvider({
  children,
  state: overrideState,
}: PlayerProviderModel) {
  const [state, dispatch] = useReducer(
    PlayerReducer,
    overrideState ?? initialPlayerContextState
  );

  return (
    <PlayerContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        <PlayerContextLoader>
          {children}
        </PlayerContextLoader>
      </PlayerDispatchContext.Provider>
    </PlayerContext.Provider>
  );
}
