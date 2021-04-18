import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { FranchiseUtilities } from '../../utilities/FranchiseAvatar';

interface FranchiseCardProps {
    franchiseId: string
    mainName: string
    desciption?: string
    image?: string | any
}

const FranchiseCard: React.FC<FranchiseCardProps> = ({ ...props }) => {
    const avatar = props.image || new FranchiseUtilities().pickAvatarByFranchiseId(props.franchiseId);

    return (
        <Card style={{ width: '10rem' }}>
            <Card.Img variant="top" src={avatar} style={{ height: '10rem' }}/>
            <Card.Body>
                <LinkContainer to={`/franchise/${props.franchiseId}`}>
                    <Button variant="dark">{props.mainName}</Button>
                </LinkContainer>
            </Card.Body>
        </Card>
    );
}

export default FranchiseCard;