import axios, { AxiosError } from "axios";

const dataServiceRoot = process.env.REACT_APP_DATA_SERVICE;
const yahooAuthUrl = `${dataServiceRoot}/api/auth/yahoo`;

export function yahooAuth(code: string, onSuccess: { (response: any): void; (arg0: any): any; }, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooAuthUrl}?code=${code}&redirectUri=${process.env.REACT_APP_CALLBACK_URL}`;
        axios.get(url)
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}

interface YahooAuthResponse {
    access_token: string
}

export async function yahooAuthAsync(code: string) {
    const url = `${yahooAuthUrl}?code=${code}&redirectUri=${process.env.REACT_APP_CALLBACK_URL}`;
    return axios.get<YahooAuthResponse>(url);
}