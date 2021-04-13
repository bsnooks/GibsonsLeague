import React from 'react';
import Header from "./components/Header";
import RouterSwitch from "./RouterSwitch";
import { GibsonsLeagueQuery } from './generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './components/GlobalLoading';

export const GET_LEAGUE = gql`
  query GibsonsLeagueQuery {
    league {
      name
      startYear
    }
  }
`;

interface GibsonsLeagueAppProps {
    children?: any;
}

export type LeagueContextType = {
    startYear: number,
    name: string
}

const GibsonsLeagueApp: React.FC<GibsonsLeagueAppProps> = () => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_LEAGUE);

    if (loading) return <GlobalLoading />;
    if (error || !data) return null;
    if (!data.league) return null;

    const currentYear = new Date().getFullYear()
    
    const context: LeagueContextType = {
      startYear: data?.league?.startYear ?? currentYear,
      name: data?.league?.name
    }
    const LeagueContext = React.createContext(context);

    return (
        <LeagueContext.Provider value={context}>
          <Header />
          <RouterSwitch />
        </LeagueContext.Provider>
    );
}

export default GibsonsLeagueApp;