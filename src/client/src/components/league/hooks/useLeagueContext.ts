import { useContext } from "react";
import { LeagueContext } from "../contexts/LeagueContext";

export function useLeagueContext() {
    const context = useContext(LeagueContext);
    if (context === undefined) {
        throw new Error("useLeagueContext must be within a League provider");
    }
    return context;
}