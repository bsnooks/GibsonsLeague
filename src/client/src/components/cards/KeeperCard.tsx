import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Maybe, PlayerTransaction } from '../../generated/graphql';

interface KeeperCardProps {
    year: any,
    keepers: Maybe<PlayerTransaction>[]
}

const KeeperCard: React.FC<KeeperCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '25rem' }}>
            <Card.Title>{props.year}</Card.Title>
            <Card.Body>
                {
                    props.keepers.map((transaction: Maybe<PlayerTransaction>) => (
                        <Row key={transaction?.name} className="text-left">
                            <Col xs={8} className="text-nowrap text-truncate">
                                <Link to={`/player/${transaction?.playerId}`}>
                                    {transaction?.name}
                                </Link>
                            </Col>
                            <Col xs={2} className="text-nowrap text-truncate">
                                {transaction?.position}
                            </Col>
                        </Row>
                    ))
                }
            </Card.Body>
        </Card>
    );
}

export default KeeperCard;