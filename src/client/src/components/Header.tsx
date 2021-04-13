import React from 'react';
import { Button, Nav, Navbar, NavDropdown, Form, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import { GibsonsLeagueQuery } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';

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
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_FRANCHISES);

    if (loading) return null;
    if (error || !data) return null;
    if (!data.league || !data.league.franchises) return null;

    const currentYear = new Date().getFullYear() + 1
    const difference = currentYear - (data.league.startYear ?? currentYear);
    const years = Array.from({length:difference},(v,k)=>currentYear-k-1);

    return (
        <Navbar bg="light" expand="lg">
            <LinkContainer to="/">
                <Navbar.Brand>{data.league.name} History</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <NavDropdown title="Franchises" id="basic-nav-dropdown">
                        {
                            data.league.franchises.map((franchise: any) => (
                                <LinkContainer to={`/franchise/${franchise.franchiseId}`} key={franchise.franchiseId}>
                                    <NavDropdown.Item>{franchise.mainName}</NavDropdown.Item>
                                </LinkContainer>
                            ))
                        }
                    </NavDropdown>
                    <NavDropdown title="Seasons" id="basic-nav-dropdown">
                        {
                            years.map(year => (
                                <LinkContainer to={`/season/${year}`} key={year}>
                                    <NavDropdown.Item>{year}</NavDropdown.Item>
                                </LinkContainer>
                            ))
                        }
                    </NavDropdown>
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="player search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;