import { faTrophy, faForward } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { Match, Maybe } from '../../generated/graphql';
import LeagueLink from '../leagues/LeagueLink';

interface SeasonMatchCardProps {
    matches: Maybe<Array<Maybe<Match>>>,
}

const SeasonMatchCard: React.FC<SeasonMatchCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '30em' }}>
            <ListGroup variant="flush" className="text-left">
                {
                    props.matches?.map((match: Maybe<Match>) => {
                        return (
                            <ListGroupItem key={match?.winningFranchise}>
                                <Row>
                                    <Col xs={6}>
                                        <b>
                                            <LeagueLink to={`/f/${match?.winningFranchiseId}`}>
                                                {match?.winningFranchise}
                                            </LeagueLink>
                                            {match?.type?.toLowerCase() === "championship" ? <FontAwesomeIcon icon={faTrophy} className="gold ml-2" /> : null}
                                            {match?.type?.toLowerCase() === "playoff" ? <FontAwesomeIcon icon={faForward} className="ml-2" /> : null}
                                        </b>
                                    </Col>
                                    <Col xs={3}>
                                        <b>{match?.winningTeamPoints}</b>
                                    </Col>
                                    <Col xs={3}>
                                        <i>{match?.winningTeamProjectedPoints}</i>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6}>
                                        <LeagueLink to={`/f/${match?.losingFranchiseId}`}>
                                            {match?.losingFranchise}
                                        </LeagueLink>
                                        {match?.type?.toLowerCase() === "championship" ? <FontAwesomeIcon icon={faTrophy} className="silver ml-2" /> : null}
                                    </Col>
                                    <Col xs={3}>
                                        {match?.losingFranchisePoints}
                                    </Col>
                                    <Col xs={3}>
                                        <i>{match?.losingFranchiseProjectedPoints}</i>
                                    </Col>
                                </Row>
                            </ListGroupItem>);
                    })
                }
            </ListGroup>
        </Card >
    );
}

export default SeasonMatchCard;