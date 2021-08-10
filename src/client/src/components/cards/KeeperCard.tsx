import React from 'react';
import { Link } from 'react-router-dom';
import { Maybe, PlayerTransaction } from '../../generated/graphql';
import { orderBy } from 'lodash';
import { DraftPickGrader } from '../../utilities/DraftPickGrader';

interface KeeperCardProps {
    grouping: any,
    groupingLink?: string,
    keepers: Maybe<PlayerTransaction>[]
}

const KeeperCard: React.FC<KeeperCardProps> = ({ ...props }) => {

    const grader = new DraftPickGrader();
    return (
        <div className="keepers-list">
            <div className="group">
                {props.grouping}
            </div>
            <div className="keepers-headings">
                <div className="keeper-col player">Player</div>
                <div className="keeper-col position">Position</div>
                <div className="keeper-col rank">Rank</div>
                <div className="keeper-col rankppg">Rank (ppg)</div>
                <div className="keeper-col points">Points</div>
                <div className="keeper-col games">Games Played</div>
                <div className="keeper-col grade">Grade</div>
            </div>

            {
                orderBy(props.keepers, ["primaryPosition"]).map((transaction: Maybe<PlayerTransaction>) => (
                    <div key={transaction?.transactionId} className={`keeper player-${transaction?.primaryPosition}`}>
                        <div className="keeper-col player">
                            <Link to={`/player/${transaction?.playerId}`}>
                                {transaction?.name}
                            </Link>
                        </div>
                        <div className="keeper-col position">
                            {transaction?.primaryPosition}
                        </div>
                        <div className="keeper-col rank">
                            {`${transaction?.primaryPosition}-${transaction?.positionRank}`}
                        </div>
                        <div className="keeper-col rankppg">
                            {transaction?.positionRankPpg ? `${transaction?.primaryPosition}-${transaction?.positionRankPpg}` : ""}
                        </div>
                        <div className="keeper-col points">
                            {Number(transaction?.seasonPoints ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="keeper-col games">
                            {transaction?.seasonGamesPlayed}
                        </div>
                        <div className="keeper-col grade">
                            {grader.gradeKeeper(transaction)?.grade}
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default KeeperCard;