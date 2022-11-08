import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { Franchise, Maybe } from '../../generated/graphql';
import PlayerSearch, { PlayerResult } from '../controls/PlayerSearch';
import logo from '../../assets/images/logo_white.png';
import { useHistory } from 'react-router-dom';
import { useLeagueContext } from './hooks/useLeagueContext';


interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    const history = useHistory();
    const { league } = useLeagueContext();

    const franchiseNav = () => {
        if (league?.franchises)
        {
            const links =  (league?.franchises.map((franchise: Maybe<Franchise>) => (
                <LinkContainer to={`/l/${league?.leagueId}/f/${franchise?.franchiseId}`} key={franchise?.franchiseId}>
                    <NavDropdown.Item>{franchise?.mainName}</NavDropdown.Item>
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
        if (league?.franchises)
        {
            const currentYear = new Date().getFullYear() + 1
            const difference = currentYear - (league.startYear ?? currentYear);
            const years = Array.from({length:difference},(v,k)=>currentYear-k-1);

            const links = (years.map(year => (
                <LinkContainer to={`/l/${league?.leagueId}/s/${year}`} key={year}>
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

    const handleSelection = (selection: PlayerResult[]) => {
        if (selection && selection.length > 0) {
            history.push(`/l/${league?.leagueId}/p/${selection[0].playerId}`);
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
                    <LinkContainer to={`/l/${league?.leagueId}`}>
                        <Nav.Link>League</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to={`/l/${league?.leagueId}/records`}>
                        <Nav.Link>Records</Nav.Link>
                    </LinkContainer>
                    {franchiseNav()}
                    {seasonNav()}
                    <LinkContainer to={`/l/${league?.leagueId}/yahoosync`}>
                        <Nav.Link>Sync</Nav.Link>
                    </LinkContainer>
                </Nav>
                <PlayerSearch handleSelection={handleSelection} />
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;