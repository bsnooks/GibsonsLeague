import { gql, useQuery } from "@apollo/client";
import * as React from "react";
import { Route, Switch, useParams, useRouteMatch } from "react-router-dom";
import { GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs } from "../../generated/graphql";
import GlobalError from "../GlobalError";
import GlobalLoading from "../GlobalLoading";
import { useLeagueDispatch } from "./hooks/useLeagueDispatch";

type LeagueParams = {
    leagueId: string;
};


export const GET_FRANCHISES = gql`
query GibsonsLeagueQuery {
  league {
    leagueId
    name
    startYear
    franchises
    {
      franchiseId
      mainName
    }
  }
}
`;

const RouteComponents = {
    Franchises: React.lazy(() => import("../../pages/Franchises")),
    Franchise: React.lazy(() => import("../../pages/Franchise")),
    Records: React.lazy(() => import("../../pages/Records")),
    Player: React.lazy(() => import("../../pages/Player")),
    Trade: React.lazy(() => import("../../pages/Trade")),
    Season: React.lazy(() => import("../../pages/Season")),
    YahooSync: React.lazy(() => import("../../pages/YahooSync")),
}

const RouterSwitch: React.FC = () => {
    const { path } = useRouteMatch();
    const { leagueId } = useParams<LeagueParams>();
    const leagueDispatch = useLeagueDispatch();

    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery, GibsonsLeagueQueryFranchiseArgs>(
        GET_FRANCHISES,
        { variables: { id: leagueId } }
    );

    React.useEffect(() => {
        if (!data?.league) return;

        leagueDispatch({
            payload: {
                league: data.league
            }
        });
    }, [data, leagueDispatch]);

    if (loading) return <GlobalLoading mode="page" />;
    if (error || !data) return <GlobalError mode="page" apolloError={error} />;
    
    return (
        <React.Suspense fallback={<GlobalLoading mode="page" />}>
            <Switch>
                <Route exact path={path} component={RouteComponents.Franchises} />
                <Route exact path={`${path}/records`} component={RouteComponents.Records} />
                <Route path={`${path}/f/:id`} component={RouteComponents.Franchise} />
                <Route path={`${path}/p/:id`} component={RouteComponents.Player} />
                <Route path={`${path}/t/:id`} component={RouteComponents.Trade} />
                <Route path={`${path}/s/:year`} component={RouteComponents.Season} />
                <Route path={`${path}/yahoosync`} component={RouteComponents.YahooSync} />
            </Switch>
        </React.Suspense>
    );
}

export default RouterSwitch;