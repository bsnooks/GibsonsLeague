import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { DraftPick, Maybe } from '../../generated/graphql';
import { DraftPickGrader } from '../../utilities/DraftPickGrader';

interface DraftCardProps {
    grouping: any,
    groupingLink?: string,
    groupingLabel: string,
    includeFranchise?: boolean,
    picks: Maybe<DraftPick>[],
}

const DraftCard: React.FC<DraftCardProps> = ({ ...props }) => {
    const grader = new DraftPickGrader();

    return (
        <Card style={{ width: '100%' }}>
            <Card.Title>
                {
                    props.groupingLink ? (
                        <Link to={props.groupingLink}>
                            {props.groupingLabel}
                        </Link>) :
                        (<>{props.groupingLabel}</>)
                }
            </Card.Title>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Pick</th>
                            {props.includeFranchise ? <th>Franchise</th> : null}
                            <th>Player</th>
                            <th>Position Pick</th>
                            <th>Position Rank</th>
                            <th>Position Rank ppg</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.picks.map((pick: Maybe<DraftPick>) => {
                            const grade = grader.gradeDraftPick(pick);
                            return (
                                <tr key={pick?.pick} className={`text-left player-${pick?.playerPrimaryPosition}`}>
                                    <td className="text-nowrap text-truncate">{pick?.pick}</td>
                                    {
                                        props.includeFranchise ? (
                                            <td className="text-nowrap text-truncate">
                                                <Link to={`/franchise/${pick?.franchiseId}`}>
                                                    {pick?.franchiseName}
                                                </Link>
                                            </td>) : null
                                    }
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
                                    <td className="text-nowrap text-truncate">
                                        {`${grade?.grade ? grade?.grade : ""}${grade?.asterisk ? grade?.asterisk : ""}`}
                                    </td>
                                </tr>
                            )})
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default DraftCard;