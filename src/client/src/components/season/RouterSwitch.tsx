import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useLeagueContext } from "../league/hooks";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  Standings: React.lazy(() => import("./pages/Standings")),
  Draft: React.lazy(() => import("../draft/pages/Draft")),
  Keepers: React.lazy(() => import("../keeper/pages/Keepers")),
  Matchups: React.lazy(() => import("../matchup/pages/Matchups")),
  Analysis: React.lazy(() => import("./pages/Analysis")),
  Trades: React.lazy(() => import("../transaction/pages/Trades")),
  Roster: React.lazy(() => import("./pages/Roster")),
  TeamStats: React.lazy(() => import("./pages/TeamStats")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();
  const { franchise } = useLeagueContext();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.Standings} />
        <Route exact path={`${path}/standings`} component={RouteComponents.Standings} />
        <Route exact path={`${path}/draft`} component={RouteComponents.Draft} />
        <Route exact path={`${path}/keepers`} component={RouteComponents.Keepers} />
        <Route exact path={`${path}/matchups`} component={RouteComponents.Matchups} />
        <Route exact path={`${path}/analysis`} component={RouteComponents.Analysis} />
        <Route exact path={`${path}/trades`} component={RouteComponents.Trades} />
        
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}`} component={RouteComponents.Roster} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/roster`} component={RouteComponents.Roster} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/stats`} component={RouteComponents.TeamStats} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/standings`} component={RouteComponents.Standings} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/draft`} component={RouteComponents.Draft} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/keepers`} component={RouteComponents.Keepers} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/matchups`} component={RouteComponents.Matchups} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/analysis`} component={RouteComponents.Analysis} />
        <Route exact path={`${path}/franchise/${franchise?.franchiseId}/trades`} component={RouteComponents.Trades} />
      </Switch>
    </React.Suspense>
  );
};
