import React from 'react';
import { Image, Card } from 'react-bootstrap';
import franchise1 from '../assets/images/2feaf03e-fb22-498e-ac8f-e596b6ba7810.png';
import franchise2 from '../assets/images/8e9f18ff-62c3-40e8-bb10-32f74cf4ee33.png';
import franchise3 from '../assets/images/40f7599b-e68f-4bf4-9553-bf7e10924635.png';
import franchise4 from '../assets/images/66fb98f4-89a7-45f9-893a-b41d71e6249d.png';
import franchise5 from '../assets/images/825928a9-7194-43aa-b7ae-fc78c2510b16.png';
import franchise6 from '../assets/images/4449259f-64af-44fd-9235-1facc0926234.png';
import franchise7 from '../assets/images/b2220d1a-ff75-4622-9757-09978901110f.png';
import franchise8 from '../assets/images/bbe2d0ad-54cf-4c22-be82-b2a5f262a157.png';
import franchise9 from '../assets/images/f483ecf1-cd17-4991-854b-e52dfc957b45.png';
import franchise10 from '../assets/images/f5908944-6efd-40eb-af54-6c53004e0e2f.png';
import { LeagueRecords, LeagueRecord } from '../generated/graphql';

const avatars = [franchise1, franchise2, franchise3, franchise4, franchise5, franchise6, franchise7, franchise8, franchise9, franchise10];

function pickAvatarByFranchiseId(id: string) {

    return avatars.find(name => name.includes(id));
}

interface RecordCardProps {
    leagueRecord: LeagueRecords,
    image?: string | any
}

const RecordCard: React.FC<RecordCardProps> = ({ ...props }) => {
    if (!props.leagueRecord || !props.leagueRecord.top || !props.leagueRecord.top[0]) return null;

    const record = props.leagueRecord.top[0];
    const avatar = props.image || pickAvatarByFranchiseId(record.franchiseId);

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