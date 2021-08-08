import React from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Franchise } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';

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
                <Link to={`/season/${props.year}`}>
                    {props.year}
                </Link>
            </div>
            <div className="champion-col team">
                <Image roundedCircle src={winnerAvatar} style={{ width: '1.5rem' }} />
                <Link to={`/franchise/${props.winner.franchiseId}`} style={{paddingLeft:"10px"}}>
                    {props.winner.mainName}
                </Link>
            </div>
            <div className="champion-col second">
                <Image roundedCircle src={secondAvatar} style={{ width: '1.5rem' }} />
                <Link to={`/franchise/${props.second.franchiseId}`} style={{paddingLeft:"10px"}}>
                    {props.second.mainName}
                </Link>
            </div>
        </div>
    );
}

export default ChampionRow;
