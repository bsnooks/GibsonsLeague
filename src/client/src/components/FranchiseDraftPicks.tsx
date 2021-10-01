import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import DraftCard from './cards/DraftCard';
import { groupBy } from 'lodash';
import DraftGraph from './charts/DraftGraph';
import DraftPositionGraph from './charts/DraftPositionGraph';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    draftpicks(franchiseId: $franchiseId, year: $year)
    {
        year
        round
        pick
        positionPick
        playerId
        playerName
        playerPosition
        playerPrimaryPosition
        franchiseId
        franchiseName
        playerPositionRank
        playerPositionRankPpg
        gamesPlayed
        points
    }
  }
`;

interface FranchiseDraftPicksProps {
    franciseId?: any;
    year?: any;
    groupBy?: any;
}

const FranchiseDraftPicks: React.FC<FranchiseDraftPicksProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId,
                year: props.year
            }
        });

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;

    const groupByKey = props.groupBy ?? "year";
    const years = groupBy(data.draftpicks, groupByKey);

    const cards: any = [];
    const items = groupByKey === "year" ? Object.entries(years).reverse() : Object.entries(years);
    for (const [key, value] of items) {
        switch (groupByKey) {
            case "round":
                cards.push(<DraftCard grouping={key} groupingLabel={`Round ${key}`} picks={value} includeFranchise={true} key={key} />);
                break;
            case "year":
            default:
                cards.push(<DraftCard grouping={key} groupingLabel={key} groupingLink={`/season/${key}?t=draft`} picks={value} key={key} />);
                break;
        }
    }

    return (

        <section>
            {props.year && data?.draftpicks ? (
                <Row>
                    <Col sm>
                        <div className="section-title">
                            <span>Drafted Positions</span>
                        </div>
                        <div className="section-body">
                            <DraftGraph picks={data?.draftpicks} />
                        </div>
                    </Col>
                    <Col>
                        <div className="section-title">
                            <span>Positional Performance</span>
                        </div>
                        <div className="section-body">
                            <DraftPositionGraph picks={data?.draftpicks} />
                        </div>
                    </Col>
                </Row>
            ) : null}
            
            <div className="section-title">
                <span>Draft</span>
            </div>
            <div className="section-body p-3">
                {cards}
            </div>
        </section>
    );
}

export default FranchiseDraftPicks;