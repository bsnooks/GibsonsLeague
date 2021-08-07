import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Maybe, PlayerTransaction } from '../../generated/graphql';
import { orderBy } from 'lodash';
import { faMapMarkerAlt, faSignature, faSortNumericUpAlt, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DraftPickGrader } from '../../utilities/DraftPickGrader';

interface KeeperCardProps {
    grouping: any,
    groupingLink?: string,
    keepers: Maybe<PlayerTransaction>[]
}

const KeeperCard: React.FC<KeeperCardProps> = ({ ...props }) => {

    const grader = new DraftPickGrader();
    return (
        <Card style={{ width: '33rem' }}>
            <Card.Title>
                {
                    props.groupingLink ? (
                        <Link to={props.groupingLink}>
                            {props.grouping}
                        </Link>) :
                        (<>{props.grouping}</>)
                }
            </Card.Title>
            <Card.Body>
                <Row className={`text-left`}>
                    <Col xs={5} className="text-nowrap text-truncate">
                        <FontAwesomeIcon icon={faSignature} title="Name" />
                    </Col>
                    <Col xs={2} className="text-nowrap text-truncate text-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} title="Position" />
                    </Col>
                    <Col xs={3} className="text-nowrap text-truncate text-center">
                        <FontAwesomeIcon icon={faSortNumericUpAlt} title="Position Rank/Position Rank (ppg)" />
                    </Col>
                    <Col xs={2} className="text-nowrap text-truncate text-center">
                        <FontAwesomeIcon icon={faGraduationCap} title="Grade" />
                    </Col>
                </Row>
                {
                    orderBy(props.keepers, ["primaryPosition"]).map((transaction: Maybe<PlayerTransaction>) => (
                        <Row key={transaction?.name} className={`text-left player-${transaction?.primaryPosition}`}>
                            <Col xs={5} className="text-nowrap text-truncate">
                                <Link to={`/player/${transaction?.playerId}`}>
                                    {transaction?.name}
                                </Link>
                            </Col>
                            <Col xs={2} className="text-nowrap text-truncate text-center">
                                {transaction?.primaryPosition}
                            </Col>
                            <Col xs={3} className="text-nowrap text-truncate text-center">
                                {transaction?.positionRank}/{transaction?.positionRankPpg}
                            </Col>
                            <Col xs={2} className="text-nowrap text-truncate text-center">
                                {grader.gradeKeeper(transaction)?.grade}
                            </Col>
                        </Row>
                    ))
                }
            </Card.Body>
        </Card>
    );
}

export default KeeperCard;