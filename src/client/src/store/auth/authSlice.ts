
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { yahooAuth } from "../../api/auth";

interface IAuthState {
    token: string,
}

const initialState: IAuthState = {
    token: "",
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        updateToken(state, action: PayloadAction<string>) {
            state.token = action.payload
            axios.defaults.headers.common["Authorization"] = "Bearer " + state.token;
        },
    }
});

export default authSlice.reducer;
export const { updateToken } = authSlice.actions;

export const yahooLogin = (code: string, onSuccess: (response: any) => void, onError: ((reason: any) => void)) => async (dispatch: (arg0: { payload: string; type: string; }) => void) => {
    try {
        yahooAuth(code,
            (response:any) =>{
                onSuccess(response);
                dispatch(updateToken(response.access_token));
            },
            onError);
    } catch (err) {
      console.error(err);
    }
  };