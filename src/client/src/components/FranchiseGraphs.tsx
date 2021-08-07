import React from 'react';
import { GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs } from '../generated/graphql';
import { gql, useQuery } from '@apollo/client';
import GlobalLoading from './GlobalLoading';
import GlobalError from './GlobalError';
import FranchiseSeasonsGraph from './charts/FranchiseSeasonsGraph';
import FranchiseWeekPointsGraph from './charts/FranchiseWeekPointsGraph';

export const GET_TRADES = gql`
  query GibsonsLeagueQuery($franchiseId: Guid) {
    matches(franchiseId: $franchiseId)
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

interface FranchiseGraphsProps {
    franciseId: any;
}

const FranchiseGraphs: React.FC<FranchiseGraphsProps> = ({ ...props }) => {
    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryDraftpicksArgs>(GET_TRADES,
        {
            variables: {
                franchiseId: props.franciseId
            }
        });

    if (loading) return <GlobalLoading mode="component" />;
    if (error || !data) return <GlobalError mode="component" apolloError={error} />;

    return (

        <section>
            <div className="d-flex flex-wrap justify-content-center">
                {data.matches?<FranchiseSeasonsGraph matches={data.matches} franchiseId={props.franciseId} /> : null}
                {data.matches?<FranchiseWeekPointsGraph matches={data.matches} franchiseId={props.franciseId} /> : null}
            </div>
        </section>
    );
}

export default FranchiseGraphs;