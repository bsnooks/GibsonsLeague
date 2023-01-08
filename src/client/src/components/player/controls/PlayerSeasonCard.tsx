import React from 'react';
import { Maybe, PlayerSeason } from '../../../generated/graphql';
import TransactionRow from '../../controls/TransactionRow';

interface PlayerSeasonCardProps {
    playerSeason: Maybe<PlayerSeason>
}

export const PlayerSeasonCard: React.FC<PlayerSeasonCardProps> = ({ ...props }) => {
    const season = props.playerSeason;

    if (!season) { return null; }

    const percentStarted = season.gamesPlayed > 0 ? ((season.gamesStarted ?? 0) / season.gamesPlayed * 100) : 0;

    return (
        <div className="transactions-list">
            <div className="year">{`${season?.year} (${season.gamesPlayed} GP - ${percentStarted.toFixed(0)}% started)`}</div>
            <div className="transactions-headings">
                <div className="transaction-col team">Team</div>
                <div className="transaction-col date d-none d-md-block">Date</div>
                <div className="transaction-col details">Details</div>
            </div>
            {
                season?.transactions?.map((transaction) =>
                    transaction ? <TransactionRow key={transaction.transactionId} transaction={transaction} year={season.year} /> : null
                )
            }
        </div>
    );
}
