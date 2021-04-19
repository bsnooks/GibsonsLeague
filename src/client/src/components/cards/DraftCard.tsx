import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';

interface DraftCardProps {
    grouping: any,
    groupingLink: string,
    picks: Maybe<DraftPick>[]
}

const DraftCard: React.FC<DraftCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '25rem' }}>
            <Card.Title>
                <Link to={props.groupingLink}>
                    {props.grouping}
                </Link>
            </Card.Title>
            <Card.Body>
                {
                    props.picks.map((pick: Maybe<DraftPick>) => (
                        <Row key={pick?.pick} className={`text-left player-${pick?.playerPrimaryPosition}`}>
                            <Col xs={2} className="text-nowrap text-truncate">{pick?.pick}</Col>
                            <Col xs={7} className="text-nowrap text-truncate">
                                <Link to={`/player/${pick?.playerId}`}>
                                    {pick?.playerName}
                                </Link>
                            </Col>
                            <Col xs={3} className="text-nowrap text-truncate">
                                {`${pick?.playerPrimaryPosition}-${pick?.positionPick}`}
                            </Col>
                        </Row>
                    ))
                }
            </Card.Body>
        </Card>
    );
}

export default DraftCard;