import * as React from "react";
import { Container, Spinner } from "react-bootstrap";

interface GlobalLoadingProps {
  mode?: string;
  message?: string;
}

export const GlobalLoading: React.FC<GlobalLoadingProps> = ({ ...props }) => {
  const [loadingMessage, setLoadingMessage] = React.useState("");

  const shuffle = React.useCallback(() => {
    const loadingMessages = [
      "Turning on the database...",
      "Loading data...",
      "Hang in there...",
      "Eli is a hall of famer...",
      "Performance is what you pay for...",
    ];
    const index = Math.floor(Math.random() * loadingMessages.length);
    setLoadingMessage(loadingMessages[index]);
  }, []);

  React.useEffect(() => {
    const intervalID = setInterval(shuffle, 2000);
    return () => clearInterval(intervalID);
  }, [shuffle]);

  switch (props.mode) {
    case "page":
      return (
        <Container className="p-2">
          <Spinner animation="border" role="status" variant="success">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <div>{loadingMessage}</div>
        </Container>
      );

    default:
      return (
        <Spinner animation="border" role="status" variant="success">
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
  }
};
