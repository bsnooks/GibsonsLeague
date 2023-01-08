import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { GlobalLoading, GlobalError } from '../components/ui';
import { useHistory } from "react-router";
import { useAuthDispatch } from "../components/auth/hooks/useAuthDispatch";
import { yahooAuthAsync } from "../api/auth";
interface CallbackProps {}

const Callback: React.FC<CallbackProps> = () => {
  const authDispatch = useAuthDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const code: string = urlParams.get("code") ?? "";
  const history = useHistory();

  const authMutation = useMutation(yahooAuthAsync, {
    onSuccess: (response) => {
      authDispatch({
        payload: {
          token: response.data.token,
          username: response.data.username,
        },
      });
      history.push("/yahoosync");
    },
  });

  useEffect(() => {
    authMutation.mutate(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!code)
    return (
      <GlobalError
        mode="page"
        errorMessage="Failed to load Yahoo! Auth Code. Please try again later."
      />
    );
  if (authMutation.isError)
    return (
      <GlobalError
        mode="page"
        errorMessage="Failed to authenticate with Yahoo! Auth Code. Please try again later."
      />
    );
  if (authMutation.isLoading) return <GlobalLoading mode="page" />;

  return (
    <GlobalError
      mode="page"
      errorMessage="Unexpected error syncing with Yahoo!"
    />
  );
};

export default Callback;
