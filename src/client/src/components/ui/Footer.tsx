import React from "react";
import { Container } from "react-bootstrap";
import { faYahoo, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faPencilRuler } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface FooterProps {
  children?: any;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="footer">
      <Container>
        <div className="text-muted text-left">
          &copy; GL 2002-{new Date().getFullYear()} |{" "}
          <a href="https://github.com/bsnooks/GibsonsLeague">
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>{" "}
          |{" "}
          <Link to="/login">
            <FontAwesomeIcon icon={faYahoo} /> Sync
          </Link>{" "}
          |{" "}
          <Link to="/draft">
            <FontAwesomeIcon icon={faPencilRuler} /> Live Drafts
          </Link>
        </div>
      </Container>
    </footer>
  );
};
