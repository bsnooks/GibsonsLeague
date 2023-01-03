import { Header, Footer } from "./components/ui";
import RouterSwitch from "./RouterSwitch";
import './App.css';
import { AuthProvider } from "./components/auth/contexts/AuthContext";
import { LeagueProvider } from "./components/league/contexts/LeagueContext";
import { PlayerProvider } from "./components/player/contexts";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <LeagueProvider>
          <PlayerProvider>
            <Header />
            <div className="content">
              <RouterSwitch />
            </div>
            <Footer />
          </PlayerProvider>
        </LeagueProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
