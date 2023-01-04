import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useLeagueContext } from "../hooks";

interface LeagueLinkProps {
  children: ReactNode;
  to: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const LeagueLink: React.FC<LeagueLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");
  
  // hooks
  const { season, franchise } = useLeagueContext();
  
  useEffect(() => {
    let linkPrefix = "";
    if (season && franchise) {
      linkPrefix = `/season/${season.year}/franchise/${franchise.franchiseId}`;
    } else if (franchise) {
      linkPrefix = `/franchise/${franchise.franchiseId}`;
    } else if (season) {
      linkPrefix = `/season/${season.year}`;
    } else {
      linkPrefix = `/`;
    }

    setPath(`${linkPrefix}${props.to.startsWith("/") ? "" : "/"}${props.to}`);
  }, [franchise, props.to, season]);

  return (
    <Link to={path} title={props.title} className={props.className} style={props.style}>{props.children}</Link>);
}

export const LeagueLinkContainer: React.FC<LeagueLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");

  // hooks
  const { season, franchise } = useLeagueContext();
  
  useEffect(() => {
    let linkPrefix = "";
    if (season && franchise) {
      linkPrefix = `/season/${season.year}/franchise/${franchise.franchiseId}`;
    } else if (franchise) {
      linkPrefix = `/franchise/${franchise.franchiseId}`;
    } else if (season) {
      linkPrefix = `/season/${season.year}`;
    } else {
      linkPrefix = `/`;
    }

    setPath(`${linkPrefix}${props.to.startsWith("/") ? "" : "/"}${props.to}`);
  }, [franchise, props.to, season]);

  return (
    <LinkContainer to={path} title={props.title} className={props.className} style={props.style}>{props.children}</LinkContainer>);
}
