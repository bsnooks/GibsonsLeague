import { ApolloError } from "@apollo/client";
import * as React from "react"
import { Container } from "react-bootstrap";

interface GlobalErrorProps {
    mode?: string,
    errorMessage?: string
    apolloError?: ApolloError
}

const GlobalError: React.FC<GlobalErrorProps> = ({ ...props }) => {
    const errorMessage: string = props.errorMessage ?? "Sorry Something went wrong, please try again later";
    const moreInfo = props.apolloError ? props.apolloError.message : null;

    switch (props.mode) {
        case "page":
            return (
                <Container className="p-3">
                    <div>
                        <h1>Oops</h1>
                        <div>
                            {errorMessage}
                        </div>
                        <iframe title="oops" src="https://giphy.com/embed/fsnzYr1pgvAQM" width="480" height="320" frameBorder="0" className="giphy-embed" allowFullScreen>
                        </iframe>
                        <div>
                            <p className="font-italic">{moreInfo}</p>
                        </div>
                    </div>
                </Container>
            );

        default:
            return (
                <>
                    <div>
                        {errorMessage}
                    </div>
                    <div>
                        {moreInfo}
                    </div>
                </>
            );
    }
}

export default GlobalError;
