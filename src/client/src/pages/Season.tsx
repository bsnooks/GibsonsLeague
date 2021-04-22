import React from 'react';
import { Container, Jumbotron, Tabs, Tab, Image, Col, Row } from 'react-bootstrap';
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
import { LinkContainer } from 'react-router-bootstrap';
import FranchiseDraftPicks from '../components/FranchiseDraftPicks';
import FranchiseMatches from '../components/FranchiseMatches';

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
    }	
  }
`;

interface SeasonProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Season: React.FC<SeasonProps> = ({ ...props }) => {

  const year:number = parseInt(props.match.params.year);
  const nextYear:number = year + 1;
  const previousYear:number = year - 1;

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
    <Container>
      <Jumbotron fluid>
        <Container>
          <Row>
            <Col md="auto">
              <LinkContainer to={`/season/${previousYear}`}>
                <div className="btn">
                  <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                </div>
              </LinkContainer>
            </Col>
            <Col>
              <h1>{year}</h1>
              <Container>
                <Row>
                  <Col>
                    <FontAwesomeIcon icon={faTrophy} className="gold" size="3x" />
                  </Col>
                  <Col>
                    <FontAwesomeIcon icon={faTrophy} className="silver" size="3x" />
                  </Col>
                  <Col>
                    <FontAwesomeIcon icon={faTrophy} className="bronze" size="3x" />
                  </Col>
                </Row>
                <Row className="my-3">
                  <Col>
                    <Link to={`/franchise/${champion?.franchiseId}`}>
                      {champion?.franchiseName}
                    </Link>
                  </Col>
                  <Col>
                    <Link to={`/franchise/${secondPlace?.franchiseId}`}>
                      {secondPlace?.franchiseName}
                    </Link>
                  </Col>
                  <Col>
                    <Link to={`/franchise/${thirdPlace?.franchiseId}`}>
                      {thirdPlace?.franchiseName}
                    </Link>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Image roundedCircle src={championAvatar} style={{ width: '5rem', height: '5rem' }} />
                  </Col>
                  <Col>
                    <Image roundedCircle src={secondPlaceAvatar} style={{ width: '5rem', height: '5rem' }} />
                  </Col>
                  <Col>
                    <Image roundedCircle src={thirdPlaceAvatar} style={{ width: '5rem', height: '5rem' }} />
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col md="auto">
              <LinkContainer to={`/season/${nextYear}`}>
                <div className="btn">
                  <FontAwesomeIcon icon={faArrowRight} size="2x" />
                </div>
              </LinkContainer>
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Tabs defaultActiveKey="standings">
        <Tab eventKey="standings" title="Standings">
          <StandingsCard franchises={teams} />
        </Tab>
        <Tab eventKey="matchups" title="Matchups">
          <FranchiseMatches year={year} />
        </Tab>
        <Tab eventKey="keepers" title="Keepers">
          <FranchiseKeepers year={year} groupBy="franchiseName" />
        </Tab>
        <Tab eventKey="draft" title="Draft">
          <FranchiseDraftPicks year={year} groupBy="round" />
        </Tab>
        <Tab eventKey="trades" title="Trades">
          <FranchiseTrades year={year} />
        </Tab>
      </Tabs>

    </Container>
  );
}

export default Season;