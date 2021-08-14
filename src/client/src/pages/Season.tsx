import React from 'react';
import { Container, Tab, Image, Col, Row, Nav } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { FranchiseUtilities } from '../utilities/FranchiseAvatar';
import { orderBy } from 'lodash';
import { GibsonsLeagueQuery, GibsonsLeagueQuerySeasonArgs } from '../generated/graphql';
import { faTrophy, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import StandingsCard from '../components/cards/StandingsCard';
import FranchiseTrades from '../components/FranchiseTrades';
import FranchiseKeepers from '../components/FranchiseKeepers';
import FranchiseDraftPicks from '../components/FranchiseDraftPicks';
import FranchiseMatches from '../components/FranchiseMatches';
import { LinkContainer } from 'react-router-bootstrap';
import SeasonPositionPoints from '../components/charts/SeasonPositionPoints';

export const GET_TEAMS = gql`
  query GibsonsLeagueQuery($year: Int) {
    season(year: $year)
    {
      year
      yahooGameId
      teams
      {
        franchiseId
        franchiseName
        wins
        loses
        ties
        champion
        secondPlace
        standing
        points
      }
      positionComparison
      {
        position
        points
        positionRank
        name
        gamesPlayed
      }
    }	
  }
`;

interface SeasonProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Season: React.FC<SeasonProps> = ({ ...props }) => {

  const year: number = parseInt(props.match.params.year);
  const nextYear: number = year + 1;
  const previousYear: number = year - 1;

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQuerySeasonArgs>(
    GET_TEAMS,
    {
      variables: {
        year: year
      }
    }
  );

  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('t') ?? "standings";

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.season || !data.season.teams) return <p>Not Found</p>;

  const teams = data.season?.teams;

  const champion = teams.find(t => t?.champion === true);
  const secondPlace = teams.find(t => t?.secondPlace === true);
  const thirdPlace = orderBy(teams.filter(t => t?.champion !== true && t?.secondPlace !== true), ["standing"], ["asc"])[0];

  const championAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(champion?.franchiseId);
  const secondPlaceAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(secondPlace?.franchiseId);
  const thirdPlaceAvatar = new FranchiseUtilities().pickAvatarByFranchiseId(thirdPlace?.franchiseId);
  return (
    <div className="page">
      <Tab.Container defaultActiveKey={defaultTab}>
        <Container fluid style={{ backgroundColor: "#FFF" }}>
          <Container className="p-3">
            <Row>
              <Col md="auto" style={{ margin: "auto" }}>
                <LinkContainer to={`/season/${previousYear}`}>
                  <div className="btn">
                    <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                  </div>
                </LinkContainer>
              </Col>
              <Col>
                <div>
                  <div style={{ display: "inline-block", verticalAlign: "bottom", width: "150px" }}>
                    <div>
                      <Image roundedCircle src={secondPlaceAvatar} style={{ width: '5rem', height: '5rem' }} />
                    </div>
                    <Link to={`/franchise/${secondPlace?.franchiseId}`}>
                      {secondPlace?.franchiseName}
                    </Link>
                    <div style={{ borderLeft: "1px solid black", borderTop: "1px solid black", padding: "20px", height: "100px", backgroundColor: "#f3f4f5" }}>
                      <FontAwesomeIcon icon={faTrophy} className="silver" size="3x" />
                    </div>
                  </div>
                  <div style={{ display: "inline-block", verticalAlign: "bottom", width: "150px" }}>
                    <div>
                      <Image roundedCircle src={championAvatar} style={{ width: '5rem', height: '5rem' }} />
                    </div>
                    <Link to={`/franchise/${champion?.franchiseId}`}>
                      {champion?.franchiseName}
                    </Link>
                    <div style={{ borderLeft: "1px solid black", borderTop: "1px solid black", borderRight: "1px solid black", padding: "20px", height: "125px", backgroundColor: "#f3f4f5" }}>
                      <FontAwesomeIcon icon={faTrophy} className="gold" size="3x" />
                      <h1>{year}</h1>
                    </div>
                  </div>
                  <div style={{ display: "inline-block", verticalAlign: "bottom", width: "150px" }}>
                    <div>
                      <Image roundedCircle src={thirdPlaceAvatar} style={{ width: '5rem', height: '5rem' }} />
                    </div>
                    <Link to={`/franchise/${thirdPlace?.franchiseId}`}>
                      {thirdPlace?.franchiseName}
                    </Link>
                    <div style={{ borderTop: "1px solid black", borderRight: "1px solid black", padding: "20px", height: "75px", backgroundColor: "#f3f4f5" }}>
                      <FontAwesomeIcon icon={faTrophy} className="bronze" size="3x" />
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="auto" style={{ margin: "auto" }}>
                <LinkContainer to={`/season/${nextYear}`}>
                  <div className="btn">
                    <FontAwesomeIcon icon={faArrowRight} size="2x" />
                  </div>
                </LinkContainer>
              </Col>
            </Row>
          </Container>
          <Container>
            <Nav>
              <Nav.Item><Nav.Link eventKey="standings">Standings</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="matchups">Matchups</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="keepers">Keepers</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="draft">Drafts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="trades">Trades</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="analyze">Analyze</Nav.Link></Nav.Item>
            </Nav>
          </Container>
        </Container>
        <Container>
          <Tab.Content>
            <Tab.Pane eventKey="standings">
              <StandingsCard franchises={teams} />
            </Tab.Pane>
            <Tab.Pane eventKey="matchups">
              <FranchiseMatches year={year} />
            </Tab.Pane>
            <Tab.Pane eventKey="keepers">
              <FranchiseKeepers year={year} groupBy="franchiseName" />
            </Tab.Pane>
            <Tab.Pane eventKey="draft">
              <FranchiseDraftPicks year={year} groupBy="round" />
            </Tab.Pane>
            <Tab.Pane eventKey="trades">
              <FranchiseTrades year={year} />
            </Tab.Pane>
            <Tab.Pane eventKey="analyze">
              <div className="section-title">
                <span>Positional Point Difference</span>
              </div>
              <div className="section-body">
                <SeasonPositionPoints comparisonSeasons={data.season.positionComparison} usePpg={false} />
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Container>
      </Tab.Container>
    </div>
  );
}

export default Season;