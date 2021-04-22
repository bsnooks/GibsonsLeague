import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Maybe, PlayerTransaction } from '../../generated/graphql';
import { orderBy } from 'lodash';

interface KeeperCardProps {
    grouping: any,
    groupingLink?: string,
    keepers: Maybe<PlayerTransaction>[]
}

const KeeperCard: React.FC<KeeperCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '22rem' }}>
            <Card.Title>
                {
                    props.groupingLink ? (
                        <Link to={props.groupingLink}>
                            {props.grouping}
                        </Link>) :
                        (<>{props.grouping}</>)
                }
            </Card.Title>
            <Card.Body>
                {
                    orderBy(props.keepers, ["primaryPosition"]).map((transaction: Maybe<PlayerTransaction>) => (
                        <Row key={transaction?.name} className={`text-left player-${transaction?.primaryPosition}`}>
                            <Col xs={9} className="text-nowrap text-truncate">
                                <Link to={`/player/${transaction?.playerId}`}>
                                    {transaction?.name}
                                </Link>
                            </Col>
                            <Col xs={3} className="text-nowrap text-truncate">
                                {transaction?.primaryPosition}
                            </Col>
                        </Row>
                    ))
                }
            </Card.Body>
        </Card>
    );
}

export default KeeperCard;