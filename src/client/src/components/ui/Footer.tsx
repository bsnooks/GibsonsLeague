import React from 'react';
import { Container } from 'react-bootstrap';
import { faYahoo, faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

interface FooterProps {
    children?: any;
}

export const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="footer">
            <Container>
                <div className="text-muted text-left">
                    &copy; Gibson's League 2002-{new Date().getFullYear()} | <a href="https://github.com/bsnooks/GibsonsLeague"><FontAwesomeIcon icon={faGithub} /> GitHub</a> | <Link to="/login"><FontAwesomeIcon icon={faYahoo} /> Sync with Yahoo!</Link>
                </div>
            </Container>
        </footer>
    );
}
