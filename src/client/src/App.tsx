import RouterSwitch from "./RouterSwitch";
import { AuthProvider } from "./components/auth/contexts/AuthContext";

import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <RouterSwitch />
      </AuthProvider>
    </div>
  );
}

export default App;
