import { faCheck, faFileImport, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Season } from '../../generated/graphql';

interface SyncButtonProps {
    synced: boolean;
    onSyncClick: (target: any, season: Season) => void;
    season: Season;
    import?: boolean;
}

const SyncButton: React.FC<SyncButtonProps> = ({ ...props }) => {
    const [synced, setSynced] = useState(props.synced);
    const onSyncClick = (target: any, season: Season) => {
        props.onSyncClick(target, season);
        setSynced(true);
    }

    const syncButton = <Button size="sm"><FontAwesomeIcon icon={props.import ? faFileImport : faSync} onClick={() => onSyncClick(this, props.season)} /></Button>;
    const successButton = <Button size="sm" variant="success" disabled={true}><FontAwesomeIcon icon={faCheck} /></Button>
    return synced ? successButton : syncButton;
}

export default SyncButton;
