import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';

interface DraftCardProps {
    grouping: any,
    groupingLink: string,
    picks: Maybe<DraftPick>[]
}

const DraftCard: React.FC<DraftCardProps> = ({ ...props }) => {

    return (
        <Card style={{ width: '100%' }}>
            <Card.Title>
                <Link to={props.groupingLink}>
                    {props.grouping}
                </Link>
            </Card.Title>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pick</th>
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

export default DraftCard;