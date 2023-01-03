import { CSSProperties, ReactNode, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeagueContext, useLeagueDispatch } from "../../league/hooks";

interface SeasonLinkProps {
  children: ReactNode;
  year?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const SeasonLink: React.FC<SeasonLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");
  
  // hooks
  const { franchise } = useLeagueContext();

  // dispatch
  const leagueDispatch = useLeagueDispatch();
  
  useEffect(() => {
    let linkPrefix = "";
    if (franchise) {
      linkPrefix = `/season/${props.year}/franchise/${franchise.franchiseId}`;
    } else {
      linkPrefix = `/season/${props.year}`;
    }

    setPath(`${linkPrefix}`)
  }, [franchise, props.year]);

  const handleLinkClicked = useCallback(() => {
    leagueDispatch({
      payload: {
        selectedYear: props.year
      }
    });
  }, [leagueDispatch, props.year]);

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