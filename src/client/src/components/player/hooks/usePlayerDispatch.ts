import { useContext } from "react";
import { PlayerDispatchContext } from "../contexts/PlayerContext";

export function usePlayerDispatch() {
    const context = useContext(PlayerDispatchContext);
    if (context === undefined) {
        throw new Error("usePlayerDispatch must be used within a Player Provider");
    }
    return context;
}