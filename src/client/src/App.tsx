import Header from "./components/Header";
import Footer from "./components/Footer";
import RouterSwitch from "./RouterSwitch";
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <RouterSwitch />
      </div>
      <Footer />
    </div>
  );
}

export default App;
