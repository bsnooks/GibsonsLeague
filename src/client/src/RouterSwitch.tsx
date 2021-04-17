import * as React from "react";
import { Route, Switch } from "react-router-dom";
import GlobalLoading from "./components/GlobalLoading";

const RouteComponents = {
    Home: React.lazy(() => import("./pages/Home")),
    Franchises: React.lazy(() => import("./pages/Franchises")),
    Franchise: React.lazy(() => import("./pages/Franchise")),
    Records: React.lazy(() => import("./pages/Records")),
    Player: React.lazy(() => import("./pages/Player")),
    NotFound: React.lazy(() => import("./pages/NotFound"))
}

const RouterSwitch: React.FC = () => {
    return (
        <React.Suspense fallback={<GlobalLoading />}>
            <Switch>
                <Route exact path="/" component={RouteComponents.Franchises} />
                <Route exact path="/records" component={RouteComponents.Records} />
                <Route path="/franchise/:id" component={RouteComponents.Franchise} />
                <Route path="/player/:id" component={RouteComponents.Player} />
                <Route component={RouteComponents.NotFound} />
            </Switch>
        </React.Suspense>
    );
}

export default RouterSwitch;