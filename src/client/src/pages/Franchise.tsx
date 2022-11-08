import React from 'react';
import { Col, Container, Row, Image, Tab, Nav } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from '../generated/graphql';
import { FranchiseUtilities } from '../utilities/FranchiseAvatar';
import FranchiseTrades from '../components/FranchiseTrades';
import FranchiseDraftPicks from '../components/FranchiseDraftPicks';
import FranchiseKeepers from '../components/FranchiseKeepers';
import FranchiseMatches from '../components/FranchiseMatches';
import SectionInfoBox from '../components/controls/SectionInfoBox';
import { Link } from 'react-router-dom';
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeagueLink from '../components/leagues/LeagueLink';

export const GET_FRANCHISE = gql`
  query GibsonsLeagueQuery($id: Guid) {
    franchise(id: $id) {
      mainName
      wins
      loses
      ties
      championships
      runnerUps
      points
      tradeCount
      teams
      {
        year
        owner
        standing
        champion
        secondPlace
        wins
        loses
        ties
        points
      }
      legends
      {
        points
        years
        player
        {
          playerId
          name
          position
        }
      }
    }
  }
`;

interface FranchiseProps {
  history?: any;
  match: any;
  image?: string | any;
}

const Franchise: React.FC<FranchiseProps> = ({ ...props }) => {

  const franchiseId = props.match.params.id;

  const {
    data,
    loading,
    error
  } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
    GET_FRANCHISE,
    {
      variables: {
        id: franchiseId
      }
    }
  );

  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('t') ?? "home";

  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  if (!data.franchise) return <p>Not Found</p>;

  const avatar = props.image || new FranchiseUtilities().pickAvatarByFranchiseId(franchiseId);
  const franchise = data.franchise;

  const championYears = franchise?.teams?.filter(t => t?.champion).map(t => t?.year);
  const championYearsText = championYears && championYears.length > 0  ? ` (${championYears.join(", ")})` : "";

  const secondYears = franchise?.teams?.filter(t => t?.secondPlace).map(t => t?.year);
  const secondYearsText = secondYears && secondYears.length > 0 ? ` (${secondYears.join(", ")})` : "";
  //function onlyUnique(value: any, index: any, self: string | any[]) {
  //  return self.indexOf(value) === index;
  //}

  const getRange = (array: number[]) : string[] => {
    var ranges = [], rstart, rend;
    for (var i = 0; i < array.length; i++) {
      rstart = array[i];
      rend = rstart;
      while (array[i + 1] - array[i] === 1) {
        rend = array[i + 1]; // increment the index if the numbers sequential
        i++;
      }
      ranges.push(rstart === rend ? rstart+'' : rstart + '-' + rend);
    }
    return ranges;
  }

  return (
    <div className="page">
      <Tab.Container defaultActiveKey={defaultTab}>
        <Container fluid style={{ backgroundColor: "#FFF" }}>
          <Container className="p-3">
            <Row>
              <Col md="auto">
                <Image rounded src={avatar} style={{ width: '10rem' }} />
              </Col>
              <Col className="franchise-header">
                <div className="name">{franchise.mainName}</div>
                <div className="championships">{`${franchise.championships} ${franchise.championships === 1 ? "Championship" : "Championships"}${championYearsText}`}</div>
                <div className="runnerUps">{`${franchise.runnerUps} ${franchise.runnerUps === 1 ? "Runner Up" : "Runner Ups"}${secondYearsText}`}</div>
                <div className="stats">{franchise.wins}-{franchise.loses}-{franchise.ties}</div>
              </Col>
            </Row>
          </Container>
          <Container>
            <Nav>
              <Nav.Item><Nav.Link eventKey="home">Home</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="keepers">Keepers</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="trades">Trades</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="drafts">Drafts</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="matchups">Matchups</Nav.Link></Nav.Item>
            </Nav>
          </Container>
        </Container>
        <Container>
          <Tab.Content>
            <Tab.Pane eventKey="home">
              <Row>
                <Col sm>
                  <div className="section-title">
                    <span>Stats</span>
                  </div>
                  <div className="section-body p-3">
                    <Row>
                      <Col><SectionInfoBox title="Points" info={Number(franchise.points ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} /></Col>
                      <Col><SectionInfoBox title="Trades" info={franchise.tradeCount} /></Col>
                    </Row>
                  </div>
                  <div className="section-title">
                    <span>Legends</span>
                  </div>
                  <div className="section-body p-3">
                    <div className="legends-list">
                      <div className="legends-headings">
                        <div className="legend-col name">Player</div>
                        <div className="legend-col years">Years</div>
                        <div className="legend-col points">Points</div>
                      </div>
                      {
                        franchise?.legends?.map((legend, int) => {
                          if (!legend) { return null; }
                          const points = Number(legend?.points ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
                          return (
                            <div key={int} className="legend">
                              <div className="legend-col name">
                                {`#${(int + 1)}. `}
                                <LeagueLink to={`/p/${legend?.player?.playerId}`} title={`${points} points`}>
                                    {legend?.player?.name}
                                </LeagueLink>
                                <span>{` (${legend?.player?.position})`}</span><br/>
                                <span className="pointstext">{`${points} points`}</span>
                              </div>
                              <div className="legend-col years">
                                {getRange([...legend.years].sort()).join(", ")}
                              </div>
                              <div className="legend-col points">RECAPTCHASECRET
                                {points}
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </Col>
                <Col sm>
                  <div className="section-title">
                    <span>Seasons</span>
                  </div>
                  <div className="section-body p-3">
                    <div className="seasons-list">
                      <div className="seasons-headings">
                        <div className="season-col year">Year</div>
                        <div className="season-col record">Record</div>
                        <div className="season-col standing">Standing</div>
                        <div className="season-col points">Points</div>
                        <div className="season-col owner">Owner</div>
                      </div>
                      {
                        franchise.teams?.filter(t => t?.standing !== 0).map((team: any) => (
                          <div key={team.year} className="season">
                              <div className="season-col year">
                                  <LeagueLink to={`/s/${team.year}?t=standings&f=${team.franchiseId}`}>
                                      {team?.year}
                                  </LeagueLink>
                              </div>
                              <div className="season-col record">
                                {team.wins}-{team.loses}-{team.ties}
                              </div>
                              <div className="season-col standing">
                                {`${team.standing}${(team.champion||team.secondPlace) ? "-" : ""}`}
                                { team.champion ? <FontAwesomeIcon icon={faTrophy} className="gold" /> : null }
                                { team.secondPlace ? <FontAwesomeIcon icon={faTrophy} className="silver" /> : null }
                              </div>
                              <div className="season-col points">
                                {Number(team.points ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </div>
                              <div className="season-col owner">
                                {team.owner}
                              </div>
                          </div>
                        ))
                      }                
                    </div>
                  </div>
                </Col>
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="keepers">
              <FranchiseKeepers franciseId={franchiseId} />
            </Tab.Pane>
            <Tab.Pane eventKey="trades" title="Trades">
              <FranchiseTrades franciseId={franchiseId} />
            </Tab.Pane>
            <Tab.Pane eventKey="drafts" title="Drafts">
              <FranchiseDraftPicks franciseId={franchiseId} />
            </Tab.Pane>
            <Tab.Pane eventKey="matchups" title="Matchups">
              <FranchiseMatches franciseId={franchiseId} />
            </Tab.Pane>
          </Tab.Content>
        </Container>
      </Tab.Container>
    </div>

  );
}

export default Franchise;