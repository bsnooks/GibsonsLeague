import { Header, RouterSwitch } from "../components/playoffPool";
import { PlayoffPoolProvider } from "../components/playoffPool/contexts";

interface PlayoffPoolProps {}

const PlayoffPool: React.FC<PlayoffPoolProps> = () => {
  return (
    <div className="page">
      <PlayoffPoolProvider>
        <Header />
        <RouterSwitch />
      </PlayoffPoolProvider>
    </div>
  );
};

export default PlayoffPool;
