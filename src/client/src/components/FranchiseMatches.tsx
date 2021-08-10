import React from 'react';
import { Col, Nav, Row, Tab } from 'react-bootstrap';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import FranchiseSeasonMatchCard from './cards/FranchiseSeasonMatchCard';
import { groupBy } from 'lodash';
import SeasonMatchCard from './cards/SeasonMatchCard';
import SeasonGraph from './charts/SeasonGraph';
import WeekPointsGraph from './charts/WeekPointsGraph';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    matches(year: $year, franchiseId: $franchiseId)
    {
      type
      year
      week
      winningFranchiseId
      winningFranchise
      winningTeamPoints
      winningTeamProjectedPoints
      losingFranchiseId
      losingFranchise
      losingFranchisePoints
      losingFranchiseProjectedPoints
      tied
    }
  }
`;

interface FranchiseMatchesProps {
    franciseId?: any,
    year?: any
}

const FranchiseMatches: React.FC<FranchiseMatchesProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId,
                year: props.year
            }
        });

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;
    

    const groupByKey = props.franciseId ? "year" : "week";
    const years = groupBy(data.matches, groupByKey);

    const tabs: any = [];
    const cards: any = [];
    for(const [key, value] of Object.entries(years))
    {

        switch (groupByKey) {
            case "year":
                tabs.push(<Nav.Item key={key}><Nav.Link eventKey={key}>{key}</Nav.Link></Nav.Item>);
                cards.push(<Tab.Pane key={key} eventKey={key}><FranchiseSeasonMatchCard franchiseId={props.franciseId} matches={value} /></Tab.Pane>);
                break;
            case "week":
            default:
                tabs.push(<Nav.Item key={key}><Nav.Link eventKey={key}>Week {key}</Nav.Link></Nav.Item>);
                cards.push(<Tab.Pane key={key} eventKey={key}><SeasonMatchCard matches={value} /></Tab.Pane>);
                break;
        }
    }

    const groupedCards = (
        <Tab.Container id="left-tabs-example" defaultActiveKey={props.franciseId ? "2020" : "graph"}>
            <Row>
                <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        {props.year && data?.matches ? <Nav.Item><Nav.Link eventKey="graph">Summary</Nav.Link></Nav.Item> : null}
                        {tabs}
                    </Nav>
                </Col>
                <Col sm={9}>
                    <Tab.Content>
                        {props.year && data?.matches ? <Tab.Pane eventKey="graph"><SeasonGraph matches={data?.matches} /><WeekPointsGraph matches={data?.matches} /></Tab.Pane> : null}
                        {cards}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );

    return (

        <section>
            {groupedCards}
        </section>
    );
}

export default FranchiseMatches;