import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

interface SeasonBadgeProps {
    year: number,
    place: number,
    franchiseId: string
}

const SeasonBadge: React.FC<SeasonBadgeProps> = ({ ...props }) => {
    return (
        <LinkContainer to={`/season/${props.year}/${props.franchiseId}`}>
            <Button variant="dark">
                {props.year} <Badge variant="light" className={`place-${props.place}`}>{props.place}</Badge>
            </Button>
        </LinkContainer>
    );
}

export default SeasonBadge;