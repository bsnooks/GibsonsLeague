import React from 'react';
import { Image, Card, Row, Col, Button } from 'react-bootstrap';
import franchise1 from '../assets/images/2feaf03e-fb22-498e-ac8f-e596b6ba7810.png';
import franchise2 from '../assets/images/8e9f18ff-62c3-40e8-bb10-32f74cf4ee33.png';
import franchise3 from '../assets/images/40f7599b-e68f-4bf4-9553-bf7e10924635.png';
import franchise4 from '../assets/images/66fb98f4-89a7-45f9-893a-b41d71e6249d.png';
import franchise5 from '../assets/images/825928a9-7194-43aa-b7ae-fc78c2510b16.png';
import franchise6 from '../assets/images/4449259f-64af-44fd-9235-1facc0926234.png';
import franchise7 from '../assets/images/b2220d1a-ff75-4622-9757-09978901110f.png';
import franchise8 from '../assets/images/bbe2d0ad-54cf-4c22-be82-b2a5f262a157.png';
import franchise9 from '../assets/images/f483ecf1-cd17-4991-854b-e52dfc957b45.png';
import franchise10 from '../assets/images/f5908944-6efd-40eb-af54-6c53004e0e2f.png';
import { FranchiseTrade } from '../generated/graphql';
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const avatars = [franchise1, franchise2, franchise3, franchise4, franchise5, franchise6, franchise7, franchise8, franchise9, franchise10];

function pickAvatarByFranchiseId(id: string) {

    return avatars.find(name => name.includes(id));
}

interface TradeCardProps {
    trade: FranchiseTrade,
    image?: string | any
}

const TradeCard: React.FC<TradeCardProps> = ({ ...props }) => {
    const trade = props.trade;
    const avatar = props.image || pickAvatarByFranchiseId(trade.franchiseId);
    const avatarTradedWith = props.image || pickAvatarByFranchiseId(trade.tradedWithFranchiseId);

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
                                        {player.name}
                                    </Link>
                                </div>
                            ))
                        }
                    </Col>
                    <Col md="auto">
                        <Link to={`/trade/${trade?.tradeId}`}>
                            <Button title="Trade Tree">
                                <FontAwesomeIcon icon={faCodeBranch} />
                            </Button>
                        </Link>
                    </Col>
                    <Col>
                        <Image src={avatarTradedWith} roundedCircle fluid style={{ width: '5rem', height: '5rem' }} />
                        <h5>{trade.tradedWithFranchiseName}</h5>
                        {
                            trade.tradedaway?.map((player: any) => (
                                <div key={player.playerId}>
                                    <Link to={`/player/${player.playerId}`} className="m-1">
                                        {player.name}
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