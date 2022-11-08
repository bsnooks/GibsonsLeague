import { faGithub } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container } from 'react-bootstrap';

interface FooterProps {
    children?: any;
}

const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="footer">
            <Container>
                <div className="text-muted text-left">
                    &copy; My Keeper League 2019-{new Date().getFullYear()} | <a href="https://github.com/bsnooks/GibsonsLeague"><FontAwesomeIcon icon={faGithub} /> GitHub</a>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;