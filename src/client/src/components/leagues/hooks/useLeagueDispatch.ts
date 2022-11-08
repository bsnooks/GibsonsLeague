import { useContext } from "react";
import { LeagueDispatchContext } from "../contexts/LeagueContext";

export function useLeagueDispatch() {
    const context = useContext(LeagueDispatchContext);
    if (context === undefined) {
        throw new Error("useLeagueDispatch must be used within a League Provider");
    }
    return context;
}
