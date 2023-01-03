import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  PlayerAnalyze: React.lazy(() => import("./pages/PlayerAnalyze")),
  PlayerOverview: React.lazy(() => import("./pages/PlayerOverview")),
  PlayerTransactions: React.lazy(() => import("./pages/PlayerTransactions")),
  PlayerGames: React.lazy(() => import("./pages/PlayerGames")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.PlayerOverview} />
        <Route path={`${path}/games`} component={RouteComponents.PlayerGames} />
        <Route path={`${path}/transactions`} component={RouteComponents.PlayerTransactions} />
        <Route path={`${path}/analyze`} component={RouteComponents.PlayerAnalyze} />
      </Switch>
    </React.Suspense>
  );
};
