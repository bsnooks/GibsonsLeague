import * as React from "react";
import { Route, Switch } from "react-router-dom";
import GlobalLoading from "./components/GlobalLoading";

const RouteComponents = {
    Franchises: React.lazy(() => import("./pages/Franchises")),
    Franchise: React.lazy(() => import("./pages/Franchise")),
    Records: React.lazy(() => import("./pages/Records")),
    NotFound: React.lazy(() => import("./pages/NotFound"))
}

const RouterSwitch: React.FC = () => {
    return (
        <React.Suspense fallback={<GlobalLoading />}>
            <Switch>
                <Route exact path="/" component={RouteComponents.Records} />
                <Route path="/franchise/:id" component={RouteComponents.Franchise} />
                <Route component={RouteComponents.NotFound} />
            </Switch>
        </React.Suspense>
    );
}

export default RouterSwitch;