import React from 'react';
import { Image } from 'react-bootstrap';
import { Franchise } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';
import LeagueLink from '../leagues/LeagueLink';

interface FranchiseStatsRowProps {
    franchise: Franchise;
}

const FranchiseStatsRow: React.FC<FranchiseStatsRowProps> = ({ ...props }) => {
    const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(props.franchise.franchiseId);

    const franchise = props.franchise;

    return (
        <div className="franchise">
            <div className="franchise-col team">
                <Image roundedCircle src={avatar} style={{ width: '1.5rem' }} />
                <LeagueLink to={`/f/${props.franchise.franchiseId}`} style={{paddingLeft:"10px"}}>
                    {props.franchise.mainName}
                </LeagueLink>
            </div>
            <div className="franchise-col record">
                {`${franchise?.wins}-${franchise?.loses}-${franchise?.ties}`}
            </div>
            <div className="franchise-col points">
                {Number(franchise.points ?? 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </div>
            <div className="franchise-col championships">
                {props.franchise.championships}
            </div>
        </div>
    );
}

export default FranchiseStatsRow;
