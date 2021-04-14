import React from 'react';
import { Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SeasonBadgeProps {
    year: number,
    place: number,
    franchiseId: string,
    champion?: boolean,
    runnerUp?: boolean
}

const SeasonBadge: React.FC<SeasonBadgeProps> = ({ ...props }) => {
    return (
        <LinkContainer to={`/season/${props.year}/${props.franchiseId}`} className="m-1">
            <Button variant="dark">
                {props.year}
                <Badge variant="light" className={`place-${props.place} mx-1`}>{props.place}</Badge>
                { props.champion ? <FontAwesomeIcon icon={faTrophy} className="gold" /> : null }
                { props.runnerUp ? <FontAwesomeIcon icon={faTrophy} className="silver" /> : null }
            </Button>
        </LinkContainer>
    );
}

export default SeasonBadge;