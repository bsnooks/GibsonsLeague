import React from 'react';
import { Card, Table } from 'react-bootstrap';
import { Match, Maybe } from '../../generated/graphql';
import LeagueLink from '../leagues/LeagueLink';

interface FranchiseSeasonMatchCardProps {
    franchiseId: any,
    matches: Maybe<Array<Maybe<Match>>>,
}

interface FranchiseMatch {
    opponentFranchiseId: any,
    opponentName: any,
    matchResult: any,
    score: any,
    projectedScore: any
}

const FranchiseSeasonMatchCard: React.FC<FranchiseSeasonMatchCardProps> = ({ ...props }) => {

    const getMatchSummary = (match: Maybe<Match>): FranchiseMatch => {
        return {
            opponentFranchiseId: match?.winningFranchiseId === props.franchiseId ? match?.losingFranchiseId : match?.winningFranchiseId,
            opponentName: match?.winningFranchiseId === props.franchiseId ? match?.losingFranchise : match?.winningFranchise,
            matchResult: match?.tied ? "TIED" : match?.winningFranchiseId === props.franchiseId ? "WIN" : "LOSS",
            score: match?.winningFranchiseId === props.franchiseId ? `${match?.winningTeamPoints} - ${match?.losingFranchisePoints}` : `${match?.losingFranchisePoints} - ${match?.winningTeamPoints}`,
            projectedScore: match?.winningFranchiseId === props.franchiseId ? `${match?.winningTeamProjectedPoints} - ${match?.losingFranchiseProjectedPoints}` : `${match?.losingFranchiseProjectedPoints} - ${match?.winningTeamProjectedPoints}`
        };
    }

    return (
        <Card style={{ width: '100%' }}>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Opponent</th>
                            <th>Result</th>
                            <th>Score</th>
                            <th>Projected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.matches?.map((match: Maybe<Match>) => {
                                const summary = getMatchSummary(match);
                                return (
                                    <tr key={match?.week} className="text-left" >
                                        <td>{match?.week}</td>
                                        <td className="text-nowrap text-truncate">
                                            <LeagueLink to={`/f/${summary.opponentFranchiseId}`}>
                                                {summary?.opponentName}
                                            </LeagueLink>
                                        </td>
                                        <td className="text-nowrap text-truncate">
                                            {`${summary?.matchResult}`}
                                        </td>
                                        <td className="text-nowrap text-truncate">
                                            {`${summary?.score}`}
                                        </td>

                                        {
                                            (match?.winningTeamProjectedPoints ?? 0) > 0 ? (
                                                <td className="text-nowrap text-truncate">
                                                    {`${summary?.projectedScore}`}
                                                </td>) : null
                                        }
                                    </tr>);
                            })
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card >
    );
}

export default FranchiseSeasonMatchCard;