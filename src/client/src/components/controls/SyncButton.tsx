import {
  faCheck,
  faFileImport,
  faSync,
  faPlus,
  faSpinner
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Season } from "../../generated/graphql";

interface SyncButtonProps {
  synced: boolean;
  onSyncClick: (target: any, season: Season) => void;
  season: Season;
  type?: "import" | "add" | undefined;
}

const SyncButton: React.FC<SyncButtonProps> = ({ ...props }) => {
  const [synced, setSynced] = useState(props.synced);
  const [syncing, setSyncing] = useState(false);
  const onSyncClick = (target: any, season: Season) => {
    props.onSyncClick(target, season);
    setSyncing(true);
  };

  useEffect(() => {
    setSynced(props.synced);
    setSyncing(false);
  }, [props.synced, props.season]);

  const syncButton = (
    <Button size="sm">
      <FontAwesomeIcon
        icon={
          props.type === "import"
            ? faFileImport
            : props.type === "add"
            ? faPlus
            : faSync
        }
        onClick={() => onSyncClick(this, props.season)}
      />
    </Button>
  );
  const successButton = (
    <Button size="sm" variant="success" disabled={true}>
      <FontAwesomeIcon icon={faCheck} />
    </Button>
  );
  const syncingButton = (
    <Button size="sm" disabled={true}>
      <FontAwesomeIcon icon={faSpinner} />
    </Button>
  );
  
  return synced ? successButton : syncing ? syncingButton : syncButton;
};

export default SyncButton;
