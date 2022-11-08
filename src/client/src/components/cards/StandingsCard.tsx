import React from 'react';
import { Table } from 'react-bootstrap';
import { Maybe, Team } from '../../generated/graphql';
import LeagueLink from '../leagues/LeagueLink';

interface StandingsCardProps {
    franchises: Maybe<Team>[]
}

const StandingsCard: React.FC<StandingsCardProps> = ({ ...props }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>W-L-T</th>
                    <th>Points</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.franchises.map((team, index) => (
                        <tr key={index}>
                            <td>{index+1}.</td>
                            <td className="text-left">
                                <LeagueLink to={`/f/${team?.franchiseId}`}>
                                    {team?.franchiseName}
                                </LeagueLink>
                            </td>
                            <td>{`${team?.wins}-${team?.loses}-${team?.ties}`}</td>
                            <td>{Number(team?.points ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    );
}

export default StandingsCard;