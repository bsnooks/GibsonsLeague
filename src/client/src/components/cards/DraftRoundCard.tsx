import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';

interface DraftRoundCardProps {
    round: any,
    picks: Maybe<DraftPick>[]
}

const DraftRoundCard: React.FC<DraftRoundCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '40rem' }}>
            <Card.Title>Round {props.round}</Card.Title>
            <Card.Body>
        {
            props.picks.map((pick: Maybe<DraftPick>) => (
                <Row key={pick?.pick} className="text-left">
                    <Col xs={2} className="text-nowrap text-truncate">{pick?.pick}</Col>
                    <Col xs={4} className="text-nowrap text-truncate">
                        <Link to={`/player/${pick?.playerId}`}>
                            {pick?.playerName}
                        </Link>
                    </Col>
                    <Col xs={2} className="text-nowrap text-truncate">
                        {pick?.playerPosition}
                    </Col>
                    <Col xs={4} className="text-nowrap text-truncate">
                        <Link to={`/franchise/${pick?.franchiseId}`}>
                            {pick?.franchiseName}
                        </Link>
                    </Col>
                </Row>
            ))
        }
        </Card.Body>
        </Card>
    );
}

export default DraftRoundCard;