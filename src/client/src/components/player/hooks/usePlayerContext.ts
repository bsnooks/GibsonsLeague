import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

export function usePlayerContext() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error("usePlayerContext must be within a Player provider");
    }
    return context;
}