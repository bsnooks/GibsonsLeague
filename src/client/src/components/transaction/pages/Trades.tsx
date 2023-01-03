import React from "react";
import { Col, Row, Container } from "react-bootstrap";
import { GlobalLoading, GlobalError } from "../../ui";
import { TradeCard } from "../controls";
import { useTrades } from "../hooks";

interface TradesProps {}

const Trades: React.FC<TradesProps> = ({ ...props }) => {
  const { trades, loading, error } = useTrades();

  if (loading) return <GlobalLoading mode="component" />;
  if (error || !trades)
    return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        <Row>
          {trades.map((trade: any) => (
            <Col sm key={trade.tradeId}>
              <TradeCard trade={trade} />
            </Col>
          ))}
        </Row>
      </section>
    </Container>
  );
};

export default Trades;
