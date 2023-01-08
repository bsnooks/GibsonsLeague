import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { GlobalLoading } from "./components/ui";

const RouteComponents = {
  Home: React.lazy(() => import("./pages/Home")),
  League: React.lazy(() => import("./pages/League")),
  Season: React.lazy(() => import("./pages/Season")),
  Franchise: React.lazy(() => import("./pages/Franchise")),
  Player: React.lazy(() => import("./pages/Player")),
  Trade: React.lazy(() => import("./pages/Trade")),
  YahooSync: React.lazy(() => import("./pages/YahooSync")),
  JoinDraft: React.lazy(() => import("./pages/JoinDraft")),
  LiveDraft: React.lazy(() => import("./pages/LiveDraft")),
  Login: React.lazy(() => import("./pages/Login")),
  Callback: React.lazy(() => import("./pages/Callback")),
  NotFound: React.lazy(() => import("./pages/NotFound")),
};

const RouterSwitch: React.FC = () => {
  return (
    <React.Suspense fallback={<GlobalLoading mode="page" />}>
      <Switch>
        <Route exact path="/" component={RouteComponents.Home} />

        <Route path="/league" component={RouteComponents.League} />
        <Route path="/season/:year" component={RouteComponents.Season} />
        <Route path="/franchise/:id" component={RouteComponents.Franchise} />

        <Route path="/player/:id" component={RouteComponents.Player} />
        <Route path="/trade/:id" component={RouteComponents.Trade} />
        
        <Route path="/login" component={RouteComponents.Login} />
        <Route path="/callback" component={RouteComponents.Callback} />
        <Route path="/yahoosync" component={RouteComponents.YahooSync} />

        
        <Route path="/draft" component={RouteComponents.JoinDraft} />
        <Route path="/draft/:id" component={RouteComponents.LiveDraft} />

        <Route component={RouteComponents.NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default RouterSwitch;
