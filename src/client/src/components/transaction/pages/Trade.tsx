import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { GlobalLoading, GlobalError } from '../../ui';
import { TradeTreeCard } from '../controls';
import { useTrade } from '../hooks';

interface TradeProps {
}

const Trade: React.FC<TradeProps> = ({ ...props }) => {

  const {
    trade,
    loading,
    error
  } = useTrade();

  if (loading) return <GlobalLoading />;
  if (error || !trade) return <GlobalError apolloError={error} />;

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