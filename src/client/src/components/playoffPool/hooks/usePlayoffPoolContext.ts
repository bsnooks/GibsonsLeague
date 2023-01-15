import { useContext } from "react";
import { PlayoffPoolContext } from "../contexts/PlayoffPoolContext";

export function usePlayoffPoolContext() {
    const context = useContext(PlayoffPoolContext);
    if (context === undefined) {
        throw new Error("usePlayoffPoolContext must be within a PlayoffPool provider");
    }
    return context;
}