import produce from "immer";
import React, { ReactNode, useReducer } from "react";
import { ILeagueContextState, UpdateLeagueState } from "./LeagueContextState";

export const initialLeagueContextState: ILeagueContextState = {
};
export const LeagueContext = React.createContext(initialLeagueContextState);

export interface Action<T, Type> {
    type?: Type;
    payload: T;
}
export const LeagueDispatchContext =
    React.createContext<React.Dispatch<Action<LeagueUpdates, "update">>>(() => {
        throw new Error("unimplemented");
    });

export type LeagueUpdates =
    UpdateLeagueState;

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
                {children}
            </LeagueDispatchContext.Provider>
        </LeagueContext.Provider>
    );
}