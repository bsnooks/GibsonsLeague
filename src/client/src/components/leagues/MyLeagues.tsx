import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GibsonsLeagueQuery } from '../../generated/graphql';
import styled from "styled-components";

import { useAuthContext } from '../auth/hooks/useAuthContext';
import GlobalError from '../GlobalError';
import GlobalLoading from '../GlobalLoading';

export const MY_LEAGUES = gql`
  query GibsonsLeagueQuery {
    leagues
    {
      leagueId
      name
      startYear
      franchises
      {
        franchiseId
        mainName
      }
    }
  }
`;

interface MyLeaguesProps { }

const MyLeagues: React.FC<MyLeaguesProps> = () => {

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery>(MY_LEAGUES);

  if (loading) return <GlobalLoading mode="component" />;
  if (error || !data) return <GlobalError mode="component" apolloError={error} />;

  return (
    <LeaguesWrapper className='text-left'>
      {data.leagues?.map((league) => {
        return (
          <LeagueWrapper key={league?.leagueId}>
            <LeagueInfo>
              <Link to={`/l/${league?.leagueId}`}>{league?.name}</Link>
              <FranchisesTitle>{` - ${league?.franchises?.length} Franchises`}</FranchisesTitle>
            </LeagueInfo>
            <EstablishedTitle>{`est. ${league?.startYear}`}</EstablishedTitle>
          </LeagueWrapper>
        );
      })}
    </LeaguesWrapper>
  );
}

export default MyLeagues;

const LeaguesWrapper = styled.div`
  padding-bottom: 10px;
`;

const LeagueWrapper = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
`;

const LeagueInfo = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const EstablishedTitle = styled.div`
  font-size: 0.7em;
`;

const FranchisesTitle = styled.div`
`;