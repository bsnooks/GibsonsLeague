import { Header, Footer } from "./components/ui";
import RouterSwitch from "./RouterSwitch";
import "./App.css";
import { AuthProvider } from "./components/auth/contexts/AuthContext";
import { LeagueProvider } from "./components/league/contexts/LeagueContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <LeagueProvider>
          <Header />
          <div className="content">
            <RouterSwitch />
          </div>
          <Footer />
        </LeagueProvider>
      </AuthProvider>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        closeButton={false}
        limit={1}
        enableMultiContainer
        pauseOnHover
      />
    </div>
  );
}

export default App;
