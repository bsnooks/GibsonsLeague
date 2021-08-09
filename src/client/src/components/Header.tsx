import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { GibsonsLeagueQuery } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import PlayerSearch from './controls/PlayerSearch';
import logo from '../assets/images/logo_white.png';
import {useHistory} from 'react-router-dom';

export const GET_FRANCHISES = gql`
  query GibsonsLeagueQuery {
    league {
      name
      startYear
      franchises
      {
        franchiseId
        mainName
      }
    }
  }
`;

interface HeaderProps {
    children?: any;
}

const Header: React.FC<HeaderProps> = () => {
    const history = useHistory();
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_FRANCHISES);

    const fanchiseNav = () => {
        if (!loading && !error && data && data.league && data.league.franchises)
        {
            const links =  (data.league.franchises.map((franchise: any) => (
                <LinkContainer to={`/franchise/${franchise.franchiseId}`} key={franchise.franchiseId}>
                    <NavDropdown.Item>{franchise.mainName}</NavDropdown.Item>
                </LinkContainer>
            )));

            return (
                <NavDropdown title="Franchises" id="basic-nav-dropdown">
                    {links}
                </NavDropdown>
            );
        }

        return null;
    }
    
    const seasonNav = () => {
        if (!loading && !error && data && data.league && data.league.franchises)
        {
            const currentYear = new Date().getFullYear() + 1
            const difference = currentYear - (data.league.startYear ?? currentYear);
            const years = Array.from({length:difference},(v,k)=>currentYear-k-1);

            const links = (years.map(year => (
                <LinkContainer to={`/season/${year}`} key={year}>
                    <NavDropdown.Item>{year}</NavDropdown.Item>
                </LinkContainer>
            )));

            return (
                <NavDropdown title="Seasons" id="basic-nav-dropdown">
                    {links}
                </NavDropdown>
            );
        }

        return null;
    }

    const handleSelection = (selection:any) => {

        if (selection && selection.length > 0) {
            console.log(selection[0].playerId);
            history.push(`/player/${selection[0].playerId}`);
        }
    };

    return (
        <Navbar bg="success" variant="dark" expand="lg" sticky="top">
            <Container>
            <LinkContainer to="/">
                <Navbar.Brand><Image src={logo} style={{ width: '50px' }} /></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/records">
                        <Nav.Link>Records</Nav.Link>
                    </LinkContainer>
                    {fanchiseNav()}
                    {seasonNav()}
                </Nav>
                <PlayerSearch handleSelection={handleSelection} />
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;