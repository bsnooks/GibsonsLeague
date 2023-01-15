import { useContext } from "react";
import { PlayoffPoolDispatchContext } from "../contexts/PlayoffPoolContext";

export function usePlayoffPoolDispatch() {
    const context = useContext(PlayoffPoolDispatchContext);
    if (context === undefined) {
        throw new Error("usePlayoffPoolDispatch must be used within a PlayoffPool Provider");
    }
    return context;
}