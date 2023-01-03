import React, { useEffect, useState } from "react";
import { groupBy } from "lodash";
import { useLeagueContext } from "../../league/hooks";
import { useMatchups } from "../hooks";
import { GlobalError, GlobalLoading } from "../../ui";
import { Col, Container, Nav, Row, Tab } from "react-bootstrap";
import { MatchCard, SeasonMatchCard } from "../controls";

interface MatchupsProps {}

const Matchups: React.FC<MatchupsProps> = ({ ...props }) => {
  // state
  const [cards, setCards] = useState([]);
  const [tabs, setTabs] = useState([]);

  // hooks
  const { season, franchise } = useLeagueContext();
  const { matchups, loading, error } = useMatchups();

  useEffect(() => {
    const groupByKey = season ? "week" : "year";
    const years = groupBy(matchups, groupByKey);

    const tabsList: any = [];
    const cardsList: any = [];
    for (const [key, value] of Object.entries(years)) {
      switch (groupByKey) {
        case "year":
          tabsList.push(
            <Nav.Item key={key}>
              <Nav.Link eventKey={key}>{key}</Nav.Link>
            </Nav.Item>
          );
          cardsList.push(
            <Tab.Pane key={key} eventKey={key}>
              <MatchCard
                franchiseId={franchise?.franchiseId}
                matches={value}
              />
            </Tab.Pane>
          );
          break;
        case "week":
        default:
          tabsList.push(
            <Nav.Item key={key}>
              <Nav.Link eventKey={key}>Week {key}</Nav.Link>
            </Nav.Item>
          );
          cardsList.push(
            <Tab.Pane key={key} eventKey={key}>
              <SeasonMatchCard matches={value} />
            </Tab.Pane>
          );
          break;
      }
    }

    setCards(cardsList);
    setTabs(tabsList);
  }, [franchise?.franchiseId, matchups, season]);

  if (loading) return <GlobalLoading mode="component" />;
  if (error) return <GlobalError mode="component" apolloError={error} />;

  return (
    <Container>
      <section>
        <Tab.Container
          id="left-tabs-example"
          defaultActiveKey={season ? "1" : "2022"}
        >
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                {tabs}
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>{cards}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </section>
    </Container>
  );
};

export default Matchups;
