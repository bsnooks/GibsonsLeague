import { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { useLeagueContext } from "./hooks/useLeagueContext";

interface LeagueLinkProps {
  children: ReactNode;
  to: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

const LeagueLink: React.FC<LeagueLinkProps> = ({ ...props }) => {
  const { league } = useLeagueContext();
  
  const path = `/l/${league?.leagueId}${props.to}`;

  return (
    <Link to={path} title={props.title} className={props.className} style={props.style}>{props.children}</Link>);
}

export default LeagueLink;