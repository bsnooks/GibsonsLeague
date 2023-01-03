import produce from "immer";
import React, { ReactNode, useReducer } from "react";
import { IAuthContextState, UpdateTokenState } from "./AuthContextState";

export const initialAuthContextState: IAuthContextState = {
};
export const AuthContext = React.createContext(initialAuthContextState);

export interface Action<T, Type> {
    type?: Type;
    payload: T;
}
export const AuthDispatchContext =
    React.createContext<React.Dispatch<Action<AuthUpdates, "update">>>(() => {
        throw new Error("unimplemented");
    });

export type AuthUpdates =
    UpdateTokenState;

function AuthReducer(
    state: IAuthContextState,
    action: Action<AuthUpdates, "update">
) {
    return produce(state, (draft) => {
        Object.assign(draft, action.payload);
    });
}

export interface AuthProviderModel {
    children: ReactNode;
    state?: IAuthContextState;
}

export function AuthProvider({
    children,
    state: overrideState,
}: AuthProviderModel) {
    const [state, dispatch] = useReducer(
        AuthReducer,
        overrideState ?? initialAuthContextState
    );

    return (
        <AuthContext.Provider value={state}>
            <AuthDispatchContext.Provider value={dispatch}>
                {children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    );
}