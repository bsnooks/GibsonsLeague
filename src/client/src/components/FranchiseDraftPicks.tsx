import React from 'react';
import { Button } from 'react-bootstrap';
import { GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import DraftCard from './cards/DraftCard';
import { groupBy } from 'lodash';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid) {
    draftpicks(franchiseId: $franchiseId)
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
    }
  }
`;

interface FranchiseDraftPicksProps {
    franciseId: any;
}

const FranchiseDraftPicks: React.FC<FranchiseDraftPicksProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error,
        fetchMore
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId
            }
        });

    const handleClick = () => {
        fetchMore({
            variables: {
                franchiseId: props.franciseId
            }
        })
    };

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;
    
    const years = groupBy(data.draftpicks, "year");

    const cards: any = [];
    for(const[key, value] of Object.entries(years).reverse())
    {
      cards.push(<DraftCard grouping={key} groupingLink={`/draft/${key}`} picks={value} key={key} />);
    }

    return (

        <section>
            <div className="d-flex flex-wrap justify-content-center">
                {cards}
            </div>
            <Button onClick={handleClick}>Load More</Button>
        </section>
    );
}

export default FranchiseDraftPicks;