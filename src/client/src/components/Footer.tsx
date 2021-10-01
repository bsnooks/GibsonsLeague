import { faYahoo, faGithub } from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store/rootReducer';

interface FooterProps {
    children?: any;
}

const Footer: React.FC<FooterProps> = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    const crypto = require('crypto');
    const nonce = crypto.randomBytes(16).toString('base64');
    const redirectUrl = process.env.REACT_APP_CALLBACK_URL
    const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.REACT_APP_YAHOO_CLIENT}&redirect_uri=${redirectUrl}&response_type=code&scope=openid&nonce=${nonce}`;

    const yahooAuthLink = <a href={yahooAuthUrl}><FontAwesomeIcon icon={faYahoo} /> Sync with Yahoo!</a>
    const yahooSyncLink = <Link to="/yahoosync"><FontAwesomeIcon icon={faYahoo} /> Sync with Yahoo!</Link>
    const yahooLink = token ? yahooSyncLink : yahooAuthLink;

    return (
        <footer className="footer">
            <Container>
                <div className="text-muted text-left">
                    &copy; Gibson's League 2002-{new Date().getFullYear()} | <a href="https://github.com/bsnooks/GibsonsLeague"><FontAwesomeIcon icon={faGithub} /> GitHub</a> | {yahooLink}
                </div>
            </Container>
        </footer>
    );
}

export default Footer;