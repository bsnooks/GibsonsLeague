import { useEffect } from "react";
import { useAuthContext } from "../../auth/hooks/useAuthContext";
import axios from "axios";

export const useYahooToken = () => {
  // hooks
  const { token } = useAuthContext();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  }, [token]);
};
