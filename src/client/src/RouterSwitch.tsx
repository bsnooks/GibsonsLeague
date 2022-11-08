import * as React from "react";
import { Route, Switch } from "react-router-dom";
import GlobalLoading from "./components/GlobalLoading";

const RouteComponents = {
    Home: React.lazy(() => import("./pages/Home")),
    League: React.lazy(() => import("./pages/League")),
    Callback: React.lazy(() => import("./pages/Callback")),
    NotFound: React.lazy(() => import("./pages/NotFound"))
}

const RouterSwitch: React.FC = () => {
    return (
        <React.Suspense fallback={<GlobalLoading mode="page"/>}>
            <Switch>
                <Route exact path="/" component={RouteComponents.Home} />
                <Route path="/l/:leagueId" component={RouteComponents.League} />
                <Route path="/callback" component={RouteComponents.Callback} />
                <Route component={RouteComponents.NotFound} />
            </Switch>
        </React.Suspense>
    );
}

export default RouterSwitch;