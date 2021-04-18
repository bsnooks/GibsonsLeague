import React from 'react';
import { Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradeArgs } from '../generated/graphql';
import TradeCard from '../components/TradeCard';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    trade(id: $id) {
      tradeId
      date
      franchiseId
      franchiseName
      tradedWithFranchiseId
      tradedWithFranchiseName
      tradedfor
      {
        playerId
        name
        position
      }
      tradedaway
      {
        playerId
        name
        position
      }
    }
  }
`;

interface TradeProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Trade: React.FC<TradeProps> = ({ ...props }) => {

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTradeArgs>(
    GET_FRANCHISE,
    {
      variables: {
        id: props.match.params.id
      }
    }
  );

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data || !data.trade) return <GlobalError mode="page" apolloError={error} />;
  
  const trade = data.trade;

  return (
    <Container>
      <section>
        <div className="d-flex flex-wrap justify-content-center">
          <TradeCard trade={trade} key={trade.tradeId} includeTradeTree={false} />
        </div>
      </section>

    </Container>
  );
}

export default Trade;