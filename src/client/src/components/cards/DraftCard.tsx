import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';

interface DraftCardProps {
    year: any,
    picks: Maybe<DraftPick>[]
}

const DraftCard: React.FC<DraftCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '25rem' }}>
            <Card.Title>{props.year}</Card.Title>
            <Card.Body>
        {
            props.picks.map((pick: Maybe<DraftPick>) => (
                <Row key={pick?.pick} className="text-left">
                    <Col xs={2} className="text-nowrap text-truncate">{pick?.pick}</Col>
                    <Col xs={8} className="text-nowrap text-truncate">
                        <Link to={`/player/${pick?.playerId}`}>
                            {pick?.playerName}
                        </Link>
                    </Col>
                    <Col xs={2} className="text-nowrap text-truncate">
                        {pick?.playerPosition}
                    </Col>
                </Row>
            ))
        }
        </Card.Body>
        </Card>
    );
}

export default DraftCard;