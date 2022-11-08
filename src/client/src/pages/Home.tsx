import React, { useEffect } from 'react';

import { useAuthContext } from '../components/auth/hooks/useAuthContext';

import Footer from '../components/Footer';
import Header from '../components/Header';
import Login from '../components/auth/Login';
import LeaguePicker from '../components/leagues/LeaguePicker';
import { Button, Col, Container, Row } from 'react-bootstrap';
import MyLeagues from '../components/leagues/MyLeagues';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {

  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) return;
  }, [token]);

  return (
    <>
      <Header />
      <div className="content">
        <Container>
          <Row>
            <Col sm>
              <div className="section-title">
                <span>My Leagues</span>
              </div>
              <div className="section-body p-3">
                { !token && <Login /> }
                { token && <MyLeagues /> }
                { token && <Button size="sm" variant="success" disabled>Sync New League</Button> }
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm>
              <div className="section-title">
                <span>Public Leagues</span>
              </div>
              <div className="section-body p-3">
                <LeaguePicker />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default Home;