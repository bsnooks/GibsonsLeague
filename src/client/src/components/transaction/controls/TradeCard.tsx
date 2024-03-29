import React from "react";
import { Image, Row, Col, Button } from "react-bootstrap";
import { FranchiseTrade } from "../../../generated/graphql";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FranchiseUtilities } from "../../../utilities/FranchiseAvatar";

interface TradeCardProps {
  trade: FranchiseTrade;
  image?: string | any;
  includeTradeTree?: boolean;
}

export const TradeCard: React.FC<TradeCardProps> = ({ ...props }) => {
  const trade = props.trade;
  const franchiseUtilities = new FranchiseUtilities();
  const avatar =
    props.image ||
    franchiseUtilities.pickAvatarByFranchiseId(trade.franchiseId);
  const avatarTradedWith =
    props.image ||
    franchiseUtilities.pickAvatarByFranchiseId(trade.tradedWithFranchiseId);

  return (
    <>
      <div className="section-title">
        <span>{new Date(trade.date).toLocaleDateString()}</span>
      </div>
      <div className="section-body p-3">
        <Row>
          <Col>
            <Image
              src={avatar}
              roundedCircle
              fluid
              style={{ width: "5rem", height: "5rem" }}
            />
            <h5>{trade.franchiseName}</h5>
            {trade.tradedfor?.map((player: any) => (
              <div key={player.playerId}>
                <Link to={`/player/${player.playerId}`} className="m-1">
                  {player.name} ({player.position})
                </Link>
              </div>
            ))}
          </Col>
          {props.includeTradeTree !== false ? (
            <Col md="auto">
              <Link to={`/trade/${trade?.tradeId}`}>
                <Button title="Trade Tree">
                  <FontAwesomeIcon icon={faCodeBranch} />
                </Button>
              </Link>
            </Col>
          ) : null}
          <Col>
            <Image
              src={avatarTradedWith}
              roundedCircle
              fluid
              style={{ width: "5rem", height: "5rem" }}
            />
            <h5>{trade.tradedWithFranchiseName}</h5>
            {trade.tradedaway?.map((player: any) => (
              <div key={player.playerId}>
                <Link to={`/player/${player.playerId}`} className="m-1">
                  {player.name} ({player.position})
                </Link>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </>
  );
};
