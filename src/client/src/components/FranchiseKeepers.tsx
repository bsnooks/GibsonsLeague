import React from 'react';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import { groupBy } from 'lodash';
import KeeperCard from './cards/KeeperCard';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid) {
    transactions(franchiseId: $franchiseId, type: KEPT)
    {
        franchiseName
        playerId
        name
        position
        year
    }
  }
`;

interface FranchiseKeepersProps {
    franciseId: any;
}

const FranchiseKeepers: React.FC<FranchiseKeepersProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTransactionsArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId
            }
        });

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;
    
    const years = groupBy(data.transactions, "year");
    console.log(years);

    const cards: any = [];
    for(const[key, value] of Object.entries(years).reverse())
    {
      cards.push(<KeeperCard year={key} keepers={value} key={key} />);
    }

    return (

        <section>
            <div className="d-flex flex-wrap justify-content-center">
                {cards}
            </div>
        </section>
    );
}

export default FranchiseKeepers;