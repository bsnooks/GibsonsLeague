import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { FranchiseTrade } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';
import TradedPlayerCard from './TradedPlayerCard';


interface TradeTreeCardProps {
    trade: FranchiseTrade
}

const TradeTreeCard: React.FC<TradeTreeCardProps> = ({ ...props }) => {
    const trade = props.trade;
    const franchiseUtilities = new FranchiseUtilities();
    const avatar = franchiseUtilities.pickAvatarByFranchiseId(trade.franchiseId);
    const avatarTradedWith = franchiseUtilities.pickAvatarByFranchiseId(trade.tradedWithFranchiseId);

    return (
        <>
            <div className="section-title">
                <span>{new Date(trade.date).toLocaleDateString()}</span>
            </div>
            <div className="section-body p-3">
                <Row>
                    <Col>
                        <Image src={avatar} roundedCircle fluid style={{ width: '5rem', height: '5rem' }} />
                        <h5>{trade.franchiseName}</h5>
                        {
                            trade.tradedfor?.map((player: any) => (
                                <TradedPlayerCard key={player.playerId} tradedPlayer={player} />
                            ))
                        }
                    </Col>
                    <Col>
                        <Image src={avatarTradedWith} roundedCircle fluid style={{ width: '5rem', height: '5rem' }} />
                        <h5>{trade.tradedWithFranchiseName}</h5>
                        {
                            trade.tradedaway?.map((player: any) => (
                                <TradedPlayerCard key={player.playerId} tradedPlayer={player} />
                            ))
                        }
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default TradeTreeCard;