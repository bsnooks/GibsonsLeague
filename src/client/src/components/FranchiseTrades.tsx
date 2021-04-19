import React from 'react';
import { Button } from 'react-bootstrap';
import { GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import TradeCard from './cards/TradeCard';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid, $year: Int) {
    trades(franchiseId: $franchiseId, year: $year)
    {
        tradeId
        date
        franchiseId
        franchiseName
        tradedWithFranchiseId
        tradedWithFranchiseName
        tradedfor
        {
            playerId
            position
            name
        }
        tradedaway
        {
            playerId
            position
            name
        }
    }
  }
`;

interface FranchiseTradesProps {
    franciseId?: any;
    year?: any;
}

const FranchiseTrades: React.FC<FranchiseTradesProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error,
        fetchMore
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryTradesArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId,
                year: props.year
            }
        });

    const handleClick = () => {
        fetchMore({
            variables: {
                franchiseId: props.franciseId,
                year: props.year
            }
        })
    };

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;

    return (

        <section>
            <div className="d-flex flex-wrap justify-content-center">
                {
                    data?.trades?.map((trade: any) => (
                        <TradeCard trade={trade} key={trade.tradeId} />
                    ))
                }
            </div>
            <Button onClick={handleClick}>Load More</Button>
        </section>
    );
}

export default FranchiseTrades;