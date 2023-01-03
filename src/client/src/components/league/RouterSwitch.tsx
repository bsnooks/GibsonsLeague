import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  LeagueHistory: React.lazy(() => import("./pages/LeagueHistory")),
  Records: React.lazy(() => import("./pages/Records")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.LeagueHistory} />
        <Route exact path={`${path}/records`} component={RouteComponents.Records} />
      </Switch>
    </React.Suspense>
  );
};
