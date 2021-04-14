import * as React from "react"
import { Spinner } from "react-bootstrap";

const GlobalLoading: React.FC = () => {
    return (
        <Spinner animation="border" role="status" variant="success">
            <span className="sr-only">Loading...</span>
        </Spinner>
    );
}

export default GlobalLoading;
