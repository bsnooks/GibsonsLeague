import { CSSProperties, ReactNode, useEffect, useState } from "react";
import { NavLinkProps } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { usePlayerContext } from "../hooks";

interface PlayerLinkProps {
  children: ReactNode;
  to: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export const PlayerLink: React.FC<PlayerLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");
  
  // hooks
  const { player } = usePlayerContext();
  
  useEffect(() => {
    let linkPrefix = "";
    if (player) {
      linkPrefix = `/player/${player.playerId}`;
    }

    setPath(`${linkPrefix}${props.to.startsWith("/") ? "" : "/"}${props.to}`);
  }, [player, props.to]);

  return (
    <Link to={path} title={props.title} className={props.className} style={props.style}>{props.children}</Link>);
}

export const PlayerLinkContainer: React.FC<PlayerLinkProps> = ({ ...props }) => {
  // state
  const [path, setPath] = useState<string>("");

  // hooks
  const { player } = usePlayerContext();
  
  useEffect(() => {
    let linkPrefix = "";
    if (player) {
      linkPrefix = `/player/${player.playerId}`;
    }

    setPath(`${linkPrefix}${props.to.startsWith("/") ? "" : "/"}${props.to}`);
  }, [player, props.to]);

  return (
    <LinkContainer to={path} title={props.title} className={props.className} style={props.style}>{props.children}</LinkContainer>);
}
