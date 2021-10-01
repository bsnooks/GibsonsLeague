import { ThunkAction } from "redux-thunk";
import { configureStore, Action } from "@reduxjs/toolkit";
import rootReducer, { RootState } from "./rootReducer";

import { createStateSyncMiddleware, initMessageListener } from "redux-state-sync";
export default function initStore() {
    const config = {
    };
    const middlewares = createStateSyncMiddleware(config);
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
                immutableCheck: false,
            }).concat(middlewares),
    });
    initMessageListener(store);

    return store;
}

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;