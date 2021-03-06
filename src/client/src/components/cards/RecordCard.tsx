import React from 'react';
import { Image, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LeagueRecords, LeagueRecord } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';

interface RecordCardProps {
    leagueRecord: LeagueRecords,
    image?: string | any
}

const RecordCard: React.FC<RecordCardProps> = ({ ...props }) => {
    if (!props.leagueRecord || !props.leagueRecord.top || !props.leagueRecord.top[0]) return null;

    const record = props.leagueRecord.top[0];
    const avatar = props.image || new FranchiseUtilities().pickAvatarByFranchiseId(record.franchiseId);

    const getRecordContext = (record: LeagueRecord) => {
        return record.year && record.week ?
            `(${record.year} - Week ${record.week})` :
            record.year ? `(${record.year})` : null;
    }

    return (
        <Card style={{ width: '40rem' }}>
            <Card.Title>{props.leagueRecord.recordTitle}</Card.Title>
            <Card.Body>
                <Row>
                    <Col xs={5}>
                        <div><Image src={avatar} roundedCircle fluid style={{ width: '8rem', height: '8rem' }} /></div>
                        <h5>
                            <Link to={`/franchise/${record.franchiseId}`}>
                                {record.franchiseName}
                            </Link>
                        </h5>
                        {getRecordContext(record)}
                        <h5>{record.recordValue}</h5>
                    </Col>
                    <Col xs={7} className="text-left">
                        {
                            props.leagueRecord.top.map((leagueRecord: any) => {
                                const progress = Math.round((leagueRecord.recordNumericValue / record.recordNumericValue) * 100);
                                return (
                                    <div key={record.rank} className="my-2">
                                        <ProgressBar now={progress} />
                                        <div>
                                            {leagueRecord.rank}.&nbsp;
                                            <Link to={`/franchise/${leagueRecord.franchiseId}`}>
                                                {leagueRecord.franchiseName}
                                            </Link>&nbsp;
                                            {getRecordContext(leagueRecord)}&nbsp;
                                            {leagueRecord.recordValue}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default RecordCard;