import React from 'react';
import styled from "styled-components";

import { faYahoo } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';

interface LoginProps { }

const Login: React.FC<LoginProps> = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const crypto = require('crypto');
  const nonce = crypto.randomBytes(16).toString('base64');
  const redirectUrl = process.env.REACT_APP_CALLBACK_URL
  const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.REACT_APP_YAHOO_CLIENT}&redirect_uri=${redirectUrl}&response_type=code&scope=openid&nonce=${nonce}`;

  return (

    <Container>
      <AuthenticationProviders>
        <LoginButton href={yahooAuthUrl}>
          <LoginButtonLogo><FontAwesomeIcon icon={faYahoo} /></LoginButtonLogo>
          <LoginButtonTitle>Connect Yahoo! League</LoginButtonTitle>
        </LoginButton>
      </AuthenticationProviders>
    </Container>
  );
}

export default Login;

const AuthenticationProviders = styled.div`
`;

const LoginButton = styled.a`
    display: flex;
    background-color: #6001D2;
    width: 400px;
    padding: 3px;
    gap: 8px;
    align-items: center;
    border-radius: 5px;
`;
const LoginButtonLogo = styled.div`
    font-size: 1.8em;
    color: #6001D2;
    background-color: #fff;
    padding: 0 6px;
`;
const LoginButtonTitle = styled.div`
    text-transform: uppercase;
    color: #fff;
`;