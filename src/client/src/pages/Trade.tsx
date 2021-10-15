import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradeArgs } from '../generated/graphql';
import TradeTreeCard from '../components/cards/TradeTreeCard';

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
        year
        playerId
        primaryPosition
        positionRank
        name
        tree
        {
          type
          transactionId
          transactionGroupId
          playerId
          year
          date
          description
          primaryPosition
          positionRank
        }
      }
      tradedaway
      {
        year
        playerId
        primaryPosition
        positionRank
        name
        tree
        {
          type
          transactionId
          transactionGroupId
          playerId
          year
          date
          description
          primaryPosition
          positionRank
        }
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
        <Row>
          <Col>
            <TradeTreeCard trade={trade} />
          </Col>
        </Row>
      </section>

    </Container>
  );
}

export default Trade;