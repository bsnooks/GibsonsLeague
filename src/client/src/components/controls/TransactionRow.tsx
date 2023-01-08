import React from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PlayerTransaction } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';

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
                <Link to={`/trade/${transaction?.transactionGroupId}`}>
                    {transaction?.description}
                </Link>
            </div>
        ) : transaction.type === "DraftPicked" ?
        (
            <div key={transaction?.transactionId}>
                <Link to={`/season/${props.year}?t=draft`}>
                    {transaction?.description}
                </Link>
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
                    <Link to={`/franchise/${props.transaction.franchiseId}`} style={{paddingLeft:"10px"}}>
                        {props.transaction.franchiseName}
                    </Link>
                </div>
            }
            <div className="transaction-col date d-none d-md-block">
                {(new Date(props.transaction.date).toLocaleDateString())}
            </div>
            <div className="transaction-col details">
                {descriptionElement}
            </div>
        </div>
    );
}

export default TransactionRow;
