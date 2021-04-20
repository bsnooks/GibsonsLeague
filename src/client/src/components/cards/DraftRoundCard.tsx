import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';

interface DraftRoundCardProps {
    round: any,
    picks: Maybe<DraftPick>[]
}

const DraftRoundCard: React.FC<DraftRoundCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '100%' }}>
            <Card.Title>Round {props.round}</Card.Title>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pick</th>
                            <th>Team</th>
                            <th>Player</th>
                            <th>Position Pick</th>
                            <th>Position Rank</th>
                            <th>Position Rank ppg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.picks.map((pick: Maybe<DraftPick>) => (
                                <tr key={pick?.pick} className={`text-left player-${pick?.playerPrimaryPosition}`}>
                                    <td className="text-nowrap text-truncate">{pick?.pick}</td>
                                    <td className="text-nowrap text-truncate">
                                        <Link to={`/franchise/${pick?.franchiseId}`}>
                                            {pick?.franchiseName}
                                        </Link>
                                    </td>
                                    <td className="text-nowrap text-truncate">
                                        <Link to={`/player/${pick?.playerId}`}>
                                            {pick?.playerName}
                                        </Link>
                                    </td>
                                    <td className="text-nowrap text-truncate">
                                        {`${pick?.playerPrimaryPosition}-${pick?.positionPick}`}
                                    </td>
                                    <td className="text-nowrap text-truncate">
                                        {pick?.playerPositionRank ? `${pick?.playerPrimaryPosition}-${pick?.playerPositionRank}` : ""}
                                    </td>
                                    <td className="text-nowrap text-truncate">
                                        {pick?.playerPositionRankPpg ? `${pick?.playerPrimaryPosition}-${pick?.playerPositionRankPpg}` : ""}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default DraftRoundCard;