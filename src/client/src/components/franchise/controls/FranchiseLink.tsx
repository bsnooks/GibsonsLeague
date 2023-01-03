import { CSSProperties, ReactNode, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeagueContext, useLeagueDispatch } from "../../league/hooks";

interface FranchiseLinkProps {
  children: ReactNode;
  franchiseId?: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const FranchiseLink: React.FC<FranchiseLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");
  
  // hooks
  const { season } = useLeagueContext();

  // dispatch
  const leagueDispatch = useLeagueDispatch();
  
  useEffect(() => {
    let linkPrefix = "";
    if (season) {
      linkPrefix = `/season/${season.year}/franchise/${props.franchiseId}`;
    } else {
      linkPrefix = `/franchise/${props.franchiseId}`;
    }

    setPath(`${linkPrefix}`)
  }, [season, props.franchiseId]);

  const handleLinkClicked = useCallback(() => {
    leagueDispatch({
      payload: {
        selectedFranchiseId: props.franchiseId
      }
    });
  }, [leagueDispatch, props.franchiseId]);

  return (
    <Link to={path}
      title={props.title}
      className={props.className}
      style={props.style}
      onClick={() => handleLinkClicked()}>
      {props.children}
    </Link>
  );
}