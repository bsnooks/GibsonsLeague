import React from 'react';
import { Image } from 'react-bootstrap';
import { PlayerTransaction } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';
import LeagueLink from '../leagues/LeagueLink';

interface TransactionRowProps {
    transaction: PlayerTransaction;
    year: number;
    hideTeam?: boolean
}

const TransactionRow: React.FC<TransactionRowProps> = ({ ...props }) => {
    const avatar = new FranchiseUtilities().pickAvatarByFranchiseId(props.transaction.franchiseId);

    const transaction = props.transaction;
    const descriptionElement = transaction.type === "Traded" ?
        (
            <div key={transaction?.transactionId}>
                <LeagueLink to={`/t/${transaction?.transactionGroupId}`}>
                    {transaction?.description}
                </LeagueLink>
            </div>
        ) : transaction.type === "DraftPicked" ?
        (
            <div key={transaction?.transactionId}>
                <LeagueLink to={`/s/${props.year}?t=draft`}>
                    {transaction?.description}
                </LeagueLink>
            </div>
        ) :
        (
            <div key={transaction?.transactionId}>
                {transaction?.description}
            </div>
        )

    return (
        <div className="transaction">
            {
                props.hideTeam ? null :
                <div className="transaction-col team">
                    <Image roundedCircle src={avatar} style={{ width: '1.5rem' }} />
                    <LeagueLink to={`/f/${props.transaction.franchiseId}`} style={{paddingLeft:"10px"}}>
                        {props.transaction.franchiseName}
                    </LeagueLink>
                </div>
            }
            <div className="transaction-col date">
                {(new Date(props.transaction.date).toLocaleDateString())}
            </div>
            <div className="transaction-col details">
                {descriptionElement}
            </div>
        </div>
    );
}

export default TransactionRow;
