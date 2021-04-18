import React from 'react';
import { Image, Card } from 'react-bootstrap';
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

    const inlineRecord = (record: LeagueRecord) => {
        const inlineRecordHolder = record.year && record.week ?
            `${record?.franchiseName} (${record.year} - Week ${record.week})` :
            record.year ? `${record?.franchiseName} (${record.year})` : record.franchiseName;
        const inlineText = `${record.rank}. ${inlineRecordHolder}: ${record?.recordValue}`;
        return (<Card.Text key={record.rank}>{inlineText}</Card.Text>);
    }

    return (
        <Card style={{ width: '25rem' }}>
            <Card.Body>
                <Image src={avatar} roundedCircle fluid style={{ width: '12rem', height: '12rem' }} />
                <Card.Title>{props.leagueRecord.recordTitle}</Card.Title>                
                {
                    props.leagueRecord.top.map((leagueRecord: any) => (
                        inlineRecord(leagueRecord)
                    ))
                }
            </Card.Body>
        </Card>
    );
}

export default RecordCard;