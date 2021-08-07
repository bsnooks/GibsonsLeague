import React from 'react';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import { groupBy } from 'lodash';
import KeeperCard from './cards/KeeperCard';
import { Col, Row } from 'react-bootstrap';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    transactions(franchiseId: $franchiseId, year: $year, type: KEPT)
    {
        franchiseId
        franchiseName
        playerId
        name
        position
        primaryPosition
        year
        positionRank
        positionRankPpg
    }
  }
`;

interface FranchiseKeepersProps {
    franciseId?: any;
    year?: any;
    groupBy?: any;
}

const FranchiseKeepers: React.FC<FranchiseKeepersProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId,
                year: props.year
            }
        });

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;
    
    const positions = groupBy(data.transactions, "position");

    const groupByKey = props.groupBy ?? "year";
    const years = groupBy(data.transactions, groupByKey);

    const cards: any = [];
    for(const[key, value] of Object.entries(years).reverse())
    {
        switch (groupByKey) {
            case "franchiseName":
                cards.push(<KeeperCard grouping={key} keepers={value} key={key} />);
                break;
            case "year":
            default:
                cards.push(<KeeperCard grouping={key} groupingLink={`/season/${key}?t=keepers`} keepers={value} key={key} />);
                break;
        }
    }

    return (

        <section>
            {
                props.groupBy === "year" ? (
                <div>
                    <Row>
                        <Col>{`QB's Kept: ${positions["QB"].length}`}</Col>
                        <Col>{`RB's Kept: ${positions["RB"].length}`}</Col>
                        <Col>{`WR's Kept: ${positions["WR"].length}`}</Col>
                        <Col>{`TE's Kept: ${positions["TE"].length}`}</Col>
                    </Row>
                </div>) : null
            }
            <div className="d-flex flex-wrap justify-content-center">
                {cards}
            </div>
        </section>
    );
}

export default FranchiseKeepers;