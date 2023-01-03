import React from "react";
import { Header, RouterSwitch } from "../components/player";
import { usePlayerContext } from "../components/player/hooks";
import { GlobalLoading, GlobalError } from "../components/ui";

interface PlayerProps {}

const Player: React.FC<PlayerProps> = () => {
  // hooks
  const { loading, error } = usePlayerContext();
  
  if (loading) return <GlobalLoading mode="page" />;
  if (error) return <GlobalError mode="page" apolloError={error} />;

  return (
    <>
      <Header />
      <RouterSwitch />
    </>
  );
};

export default Player;
