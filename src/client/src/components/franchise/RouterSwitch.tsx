import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  Franchise: React.lazy(() => import("./pages/Franchise")),
  Draft: React.lazy(() => import("../draft/pages/Draft")),
  Keepers: React.lazy(() => import("../keeper/pages/Keepers")),
  Matchups: React.lazy(() => import("../matchup/pages/Matchups")),
  Trades: React.lazy(() => import("../transaction/pages/Trades")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.Franchise} />
        <Route exact path={`${path}/drafts`} component={RouteComponents.Draft} />
        <Route exact path={`${path}/keepers`} component={RouteComponents.Keepers} />
        <Route exact path={`${path}/matchups`} component={RouteComponents.Matchups} />
        <Route exact path={`${path}/trades`} component={RouteComponents.Trades} />
      </Switch>
    </React.Suspense>
  );
};
