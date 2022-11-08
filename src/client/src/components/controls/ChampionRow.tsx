import React from 'react';
import { Image } from 'react-bootstrap';
import { Franchise } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';
import LeagueLink from '../leagues/LeagueLink';

interface ChampionRowProps {
    year: number;
    winner: Franchise;
    second: Franchise;
}

const ChampionRow: React.FC<ChampionRowProps> = ({ ...props }) => {
    const winnerAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(props.winner.franchiseId);
    const secondAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(props.second.franchiseId);

    return (
        <div className="champion">
            <div className="champion-col year">
                <LeagueLink to={`/s/${props.year}`}>
                    {props.year}
                </LeagueLink>
            </div>
            <div className="champion-col team">
                <Image roundedCircle src={winnerAvatar} style={{ width: '1.5rem' }} />
                <LeagueLink to={`/f/${props.winner.franchiseId}`} style={{paddingLeft:"10px"}}>
                    {props.winner.mainName}
                </LeagueLink>
            </div>
            <div className="champion-col second">
                <Image roundedCircle src={secondAvatar} style={{ width: '1.5rem' }} />
                <LeagueLink to={`/f/${props.second.franchiseId}`} style={{paddingLeft:"10px"}}>
                    {props.second.mainName}
                </LeagueLink>
            </div>
        </div>
    );
}

export default ChampionRow;
