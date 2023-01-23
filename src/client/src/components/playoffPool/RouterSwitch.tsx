import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  PlayoffPool: React.lazy(() => import("./pages/PlayoffPool")),
  PlayoffPoolDraft: React.lazy(() => import("./pages/PlayoffPoolDraft")),
  PlayoffPoolStats: React.lazy(() => import("./pages/PlayoffPoolStats")),
  PlayoffPoolTeams: React.lazy(() => import("./pages/PlayoffPoolTeams")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.PlayoffPool} />
        <Route exact path={`${path}/teams`} component={RouteComponents.PlayoffPoolTeams} />
        <Route exact path={`${path}/draft`} component={RouteComponents.PlayoffPoolDraft} />
        <Route exact path={`${path}/stats`} component={RouteComponents.PlayoffPoolStats} />
      </Switch>
    </React.Suspense>
  );
};
