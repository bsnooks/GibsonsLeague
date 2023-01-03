import React, { useCallback } from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import PlayerSearch from "../controls/PlayerSearch";
import logo from "../../assets/images/logo_white.png";
import { useHistory } from "react-router-dom";
import { useLeagueContext, useLeagueDispatch } from "../league/hooks";

interface HeaderProps {
  children?: any;
}

export const Header: React.FC<HeaderProps> = () => {
  // hooks
  const { league, franchise, season  } = useLeagueContext();
  const history = useHistory();

  // dispatch
  const leagueDispatch = useLeagueDispatch();

  const handleFranchiseSelected = useCallback((franchiseId: string | undefined = undefined) => {
    leagueDispatch({
      payload: {
        selectedFranchiseId: franchiseId
      }
    });
    if (season && franchiseId) {
      history.push(`/season/${season.year}/franchise/${franchiseId}`);
    } else if (franchiseId) {
      history.push(`/franchise/${franchiseId}`);
    } else if (season) {
      history.push(`/season/${season.year}`);
    } else {
      history.push(`/league`);
    }
  }, [history, leagueDispatch, season]);

  const handleSeasonSelected = useCallback((year: number | undefined = undefined) => {
    leagueDispatch({
      payload: {
        selectedYear: year
      }
    });
    if (franchise && year) {
      history.push(`/season/${year}/franchise/${franchise.franchiseId}`);
    } else if (year) {
      history.push(`/season/${year}`);
    } else if (franchise) {
      history.push(`/franchise/${franchise.franchiseId}`);
    } else {
      history.push(`/league`);
    }
  }, [franchise, history, leagueDispatch]);

  const franchiseNav = useCallback(() => {
    if (league?.franchises) {
      const links = league.franchises.map((franchise) => (
        <NavDropdown.Item key={franchise?.mainName} onClick={() => handleFranchiseSelected(franchise?.franchiseId)}>{franchise?.mainName}</NavDropdown.Item>
      ));

      links.unshift(<NavDropdown.Divider key="divider" />);
      links.unshift(<NavDropdown.Item key="All Franchises" onClick={() => handleFranchiseSelected()}>All Franchises</NavDropdown.Item>);

      return (
        <NavDropdown title={franchise ? `${franchise.mainName}` : "All Franchises"} id="basic-nav-dropdown">
          {links}
        </NavDropdown>
      );
    }

    return null;
  }, [franchise, handleFranchiseSelected, league?.franchises]);

  const seasonNav = useCallback(() => {
    if (league?.franchises) {
      const currentYear = new Date().getFullYear() + 1;
      const difference = currentYear - (league.startYear ?? currentYear);
      const years = Array.from(
        { length: difference },
        (v, k) => currentYear - k - 1
      );

      const links = years.map((year) => (
        <NavDropdown.Item key={year} onClick={() => handleSeasonSelected(year)}>{year}</NavDropdown.Item>
      ));

      links.unshift(<NavDropdown.Divider key="divider" />);
      links.unshift(<NavDropdown.Item key="All Time" onClick={() => handleSeasonSelected()}>All Time</NavDropdown.Item>);

      return (
        <NavDropdown title={season ? `${season.year}` : "All Time"} id="basic-nav-dropdown">
          {links}
        </NavDropdown>
      );
    }

    return null;
  }, [handleSeasonSelected, league?.franchises, league?.startYear, season]);

  const handleSelection = (selection: any) => {
    if (selection && selection.length > 0) {
      history.push(`/player/${selection[0].playerId}`);
    }
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <Image src={logo} style={{ width: "50px" }} />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {seasonNav()}
            {franchiseNav()}
          </Nav>
          <PlayerSearch handleSelection={handleSelection} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
