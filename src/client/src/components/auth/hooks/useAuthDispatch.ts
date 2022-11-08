import { useContext } from "react";
import { AuthDispatchContext } from "../contexts/AuthContext";

export function useAuthDispatch() {
    const context = useContext(AuthDispatchContext);
    if (context === undefined) {
        throw new Error("useAuthDispatch must be used within a Auth Provider");
    }
    return context;
}
