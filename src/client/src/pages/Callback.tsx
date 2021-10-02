import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import GlobalLoading from '../components/GlobalLoading';
import GlobalError from '../components/GlobalError';
import { yahooLogin } from '../store/auth/authSlice';
import { useHistory } from 'react-router';
interface CallbackProps { }

const Callback: React.FC<CallbackProps> = () => {

    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    const code : string = urlParams.get('code') ?? ""
    const [error, setError] = useState(false);
    const [busy, setBusy] = useState(true);
    const history = useHistory();

    
    useEffect(() => {
        if (code) {
            setBusy(true);
            dispatch(
                yahooLogin(
                    code,
                    (_) => {
                        history.push("/yahoosync");
                    },
                    (reason) => {
                        console.log(reason);
                        setError(true);
                        setBusy(false);
                    },
                )
            );
        }
    }, [code, dispatch, history]);

    if (!code) return <GlobalError mode="page" errorMessage="Failed to load Yahoo! Auth Code. Please try again later." />;
    if (error) return <GlobalError mode="page" errorMessage="Failed to authenticate with Yahoo! Auth Code. Please try again later." />;
    if (busy) return <GlobalLoading mode="page" />

    return <GlobalError mode="page" errorMessage="Unexpected error syncing with Yahoo!" />;
}

export default Callback;

