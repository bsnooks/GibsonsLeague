import React from 'react';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import { FranchiseTrade } from '../../generated/graphql';
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';


interface TradeCardProps {
    trade: FranchiseTrade,
    image?: string | any
    includeTradeTree?: boolean
}

const TradeCard: React.FC<TradeCardProps> = ({ ...props }) => {
    const trade = props.trade;    
    const franchiseUtilities = new FranchiseUtilities();
    const avatar = props.image || franchiseUtilities.pickAvatarByFranchiseId(trade.franchiseId);
    const avatarTradedWith = props.image || franchiseUtilities.pickAvatarByFranchiseId(trade.tradedWithFranchiseId);

    return (
        <Card style={{ width: '100%' }}>
            <Card.Body>
                <Card.Title>{new Date(trade.date).toLocaleDateString()}</Card.Title>
                <Row>
                    <Col>
                        <Image src={avatar} roundedCircle fluid style={{ width: '5rem', height: '5rem' }} />
                        <h5>{trade.franchiseName}</h5>
                        {
                            trade.tradedfor?.map((player: any) => (
                                <div key={player.playerId}>
                                    <Link to={`/player/${player.playerId}`} className="m-1">
                                        {player.name} ({player.position})
                                    </Link>
                                </div>
                            ))
                        }
                    </Col>
                    {
                        props.includeTradeTree !== false ? 
                            <Col md="auto">
                                <Link to={`/trade/${trade?.tradeId}`}>
                                    <Button title="Trade Tree">
                                        <FontAwesomeIcon icon={faCodeBranch} />
                                    </Button>
                                </Link>
                            </Col>
                            :
                            null
                    }
                    <Col>
                        <Image src={avatarTradedWith} roundedCircle fluid style={{ width: '5rem', height: '5rem' }} />
                        <h5>{trade.tradedWithFranchiseName}</h5>
                        {
                            trade.tradedaway?.map((player: any) => (
                                <div key={player.playerId}>
                                    <Link to={`/player/${player.playerId}`} className="m-1">
                                        {player.name} ({player.position})
                                    </Link>
                                </div>
                            ))
                        }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default TradeCard;