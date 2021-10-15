import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PlayerTransaction } from '../../generated/graphql';
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TradedPlayerCard.css';
import { groupBy } from 'lodash';
import TransactionRow from '../controls/TransactionRow';


interface TradedPlayerCardProps {
    tradedPlayer: PlayerTransaction
}

const TradedPlayerCard: React.FC<TradedPlayerCardProps> = ({ ...props }) => {
    const tradedPlayer = props.tradedPlayer;
    const [showDetails, setShowDetails] = useState(true);

    const onPlayerClick = () => {
        setShowDetails(!showDetails);
    };

    const years = groupBy(tradedPlayer.tree, "year");

    if (!tradedPlayer.tree || tradedPlayer.tree.length === 0 || !years) {
        return (
            <div className="tradedplayer">
                <div className="tradedplayer-header">
                    <Link to={`/player/${tradedPlayer.playerId}`} className="m-1">
                        {tradedPlayer.name}
                    </Link>
                    <span className="rank">{`${tradedPlayer?.primaryPosition}-${tradedPlayer?.positionRank}`}</span>
                </div>
            </div>
        );
    }

    const details: any = [];
    for (const [key, value] of Object.entries(years)) {
        if (parseInt(key) !== tradedPlayer.year) {
            const first = value[0];
            const detail = (
                <div className="year" key={key}>
                    {key}
                    <span className="rank">{`${first?.primaryPosition}-${first?.positionRank}`}</span>
                </div>
            );
            details.push(detail);
        }

        value.forEach((transaction, index) => {
            if (transaction) {
                const yearDetail = <TransactionRow key={transaction.transactionId} transaction={transaction} year={transaction.year} hideTeam={true} />;
                details.push(yearDetail);
            }
        });
    }

    return (
        <div className="tradedplayer">
            <div className="tradedplayer-header">
                <Row>
                    <Col>
                        <Link to={`/player/${tradedPlayer.playerId}`} className="m-1">
                            {tradedPlayer.name}
                        </Link>
                        <span className="rank">{`${tradedPlayer?.primaryPosition}-${tradedPlayer?.positionRank}`}</span>
                    </Col>
                    <Col md="auto">
                        <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} onClick={onPlayerClick} title="details" className="toggle" />
                    </Col>
                </Row>
                
            </div>
            <div className={`tradedplayer-body ${showDetails ? "d-block" : "d-none"}`}>
                <div className="transactions-list">
                    <div className="transactions-headings">
                        <div className="transaction-col date">Date</div>
                        <div className="transaction-col details">Details</div>
                    </div>
                    {details}
                </div>
            </div>
        </div>
    );
}

export default TradedPlayerCard;