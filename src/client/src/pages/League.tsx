import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/leagues/Header';
import { LeagueProvider } from '../components/leagues/contexts/LeagueContext';
import RouterSwitch from '../components/leagues/RouterSwitch';


interface LeagueProps { }

const League: React.FC<LeagueProps> = () => {
  return (
    <LeagueProvider>
      <Header />
      <div className="content">
        <RouterSwitch />
      </div>
      <Footer />
    </LeagueProvider>
  );
}

export default League;