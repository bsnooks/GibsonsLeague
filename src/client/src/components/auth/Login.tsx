import React from "react";
import styled from "styled-components";

import { faYahoo } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap";
import { useAuthContext } from "./hooks/useAuthContext";
import { useHistory } from "react-router";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const history = useHistory();
  const context = useAuthContext();

  const randomString = (length: number) => {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  const nonce = randomString(16);
  const redirectUrl = process.env.REACT_APP_CALLBACK_URL;
  const yahooAuthUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.REACT_APP_YAHOO_CLIENT}&redirect_uri=${redirectUrl}&response_type=code&scope=openid&nonce=${nonce}`;

  if (context.token) {
    history.push("/yahoosync");
  }

  return (
    <Container>
      <AuthenticationProviders>
        <LoginButton href={yahooAuthUrl}>
          <LoginButtonLogo>
            <FontAwesomeIcon icon={faYahoo} />
          </LoginButtonLogo>
          <LoginButtonTitle>Connect Yahoo! League</LoginButtonTitle>
        </LoginButton>
      </AuthenticationProviders>
    </Container>
  );
};

export default Login;

const AuthenticationProviders = styled.div``;

const LoginButton = styled.a`
  display: flex;
  background-color: #6001d2;
  width: 400px;
  padding: 3px;
  gap: 8px;
  align-items: center;
  border-radius: 5px;
`;
const LoginButtonLogo = styled.div`
  font-size: 1.8em;
  color: #6001d2;
  background-color: #fff;
  padding: 0 6px;
`;
const LoginButtonTitle = styled.div`
  text-transform: uppercase;
  color: #fff;
`;
