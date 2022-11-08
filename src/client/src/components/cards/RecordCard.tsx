import React from 'react';
import { Image, Row, Col, ProgressBar } from 'react-bootstrap';
import { LeagueRecords, LeagueRecord } from '../../generated/graphql';
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';
import LeagueLink from '../leagues/LeagueLink';

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
        <>
            <div className="section-title">
                <span>{props.leagueRecord.recordTitle}</span>
            </div>
            <div className="section-body p-3">
                <Row>
                    <Col xs={5}>
                        {
                            record.franchiseId ? (<>
                            <div><Image src={avatar} roundedCircle fluid style={{ width: '8rem', height: '8rem' }} /></div>
                            <h5>
                                <LeagueLink to={`/f/${record.franchiseId}`}>
                                    {record.franchiseName}
                                </LeagueLink>
                            </h5></>) : (
                                <h5>
                                    <LeagueLink to={`/p/${record.playerId}`}>
                                        {record.playerName} ({record.playerPosition})
                                    </LeagueLink>
                                </h5>
                            )
                        }
                        {getRecordContext(record)}
                        <h5>{record.recordValue}</h5>
                    </Col>
                    <Col xs={7} className="text-left record-list">
                        {
                            props.leagueRecord.top.map((leagueRecord: any, index: number) => {
                                const progress = Math.round((leagueRecord.recordNumericValue / record.recordNumericValue) * 100);
                                return (
                                    <div key={index} className="my-2">
                                        <ProgressBar now={progress} label={leagueRecord.recordValue} variant="success" />
                                        <div>
                                            {leagueRecord.rank}.&nbsp;
                                            <LeagueLink to={`/f/${leagueRecord.franchiseId}`}>
                                                {leagueRecord.franchiseName}
                                            </LeagueLink>
                                            {
                                                leagueRecord.otherFranchiseId ? " vs. " : null
                                            }
                                            {
                                                leagueRecord.otherFranchiseId ?
                                                    <LeagueLink to={`/f/${leagueRecord.otherFranchiseId}`}>
                                                        {leagueRecord.otherFranchiseName}
                                                    </LeagueLink> : null
                                            }
                                            &nbsp;
                                            {getRecordContext(leagueRecord)}
                                            {
                                                leagueRecord.playerId ? (
                                                <LeagueLink to={`/p/${leagueRecord.playerId}`}>
                                                    {leagueRecord.playerName} ({leagueRecord.playerPosition})
                                                </LeagueLink>) : null
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </Col>
                </Row>
            
            </div>
                        </>
    );
}

export default RecordCard;