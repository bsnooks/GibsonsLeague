import React from 'react';
import { Maybe, PlayerSeason } from '../../generated/graphql';
import TransactionRow from '../controls/TransactionRow';

interface PlayerSeasonCardProps {
    playerSeason: Maybe<PlayerSeason>
}

const PlayerSeasonCard: React.FC<PlayerSeasonCardProps> = ({ ...props }) => {
    const season = props.playerSeason;

    if (!season) { return null; }

    return (
        <div className="transactions-list">
            <div className="year">{season?.year}</div>
            <div className="transactions-headings">
                <div className="transaction-col team">Team</div>
                <div className="transaction-col date">Date</div>
                <div className="transaction-col details">Details</div>
            </div>
            {
                season?.transactions?.map((transaction) =>
                    //transactionRow(transaction)
                    transaction ? <TransactionRow key={transaction.transactionId} transaction={transaction} year={season.year} /> : null
                )
            }
        </div>
    );
}

export default PlayerSeasonCard;
