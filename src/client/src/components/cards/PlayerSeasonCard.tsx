import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Maybe, PlayerSeason } from '../../generated/graphql';

interface PlayerSeasonCardProps {
    playerSeason: Maybe<PlayerSeason>
}

const PlayerSeasonCard: React.FC<PlayerSeasonCardProps> = ({ ...props }) => {
    const season = props.playerSeason;

    if (!season) { return null; }

    const transactionRow = (transaction: any) => {
        switch (transaction.type) {
            case "Traded":
                return (
                    <Row key={transaction?.transactionId}>
                        <Col>
                            <Link to={`/trade/${transaction?.transactionGroupId}`}>
                                {`${transaction?.description} on ${(new Date(transaction?.date).toLocaleDateString())}`}
                            </Link>
                        </Col>
                    </Row>
                );

            case "DraftPicked":
                return (
                    <Row key={transaction?.transactionId}>
                        <Col>
                            <Link to={`/season/${season.year}?t=draft`}>
                                {`${transaction?.description} on ${(new Date(transaction?.date).toLocaleDateString())}`}
                            </Link>
                        </Col>
                    </Row>
                );

            default:
                return (
                    <Row key={transaction?.transactionId}>
                        <Col>
                            {`${transaction?.description} on ${(new Date(transaction?.date).toLocaleDateString())}`}
                        </Col>
                    </Row>
                );
        }
    };

    return (
        <>
            <Row style={{ backgroundColor: "#CCC" }}>
                <Col><b>{`${season?.year} ${(season.positionRank > 0) ? `(${season.position} Rank: ${season.positionRank}, ` : ""}${(season.positionRankPpg > 0) ? `${season.position} Rank ppg: ${season.positionRankPpg}, ` : ""}Games: ${season.gamesPlayed})`}</b></Col>
            </Row>
            {
                season?.transactions?.map((transaction) =>
                    transactionRow(transaction)
                )
            }
        </>
    );
}

export default PlayerSeasonCard;
