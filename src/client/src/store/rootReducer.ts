import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import { withReduxStateSync } from "redux-state-sync";
const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default withReduxStateSync(rootReducer);

