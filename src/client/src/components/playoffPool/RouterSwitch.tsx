import * as React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { GlobalLoading } from "../ui";

const RouteComponents = {
  PlayoffPool: React.lazy(() => import("./pages/PlayoffPool")),
};

export const RouterSwitch: React.FC = () => {
  const { path } = useRouteMatch();

  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path={path} component={RouteComponents.PlayoffPool} />
      </Switch>
    </React.Suspense>
  );
};
