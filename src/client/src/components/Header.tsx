import React from 'react';
import { Container, Navbar, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'
import logo from '../assets/images/logo_white.png';

interface HeaderProps {
    children?: any;
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <Navbar bg="success" variant="dark" expand="lg" sticky="top">
            <Container>
            <LinkContainer to="/">
                <Navbar.Brand><Image src={logo} style={{ width: '50px' }} /></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            </Container>
        </Navbar>
    );
}

export default Header;