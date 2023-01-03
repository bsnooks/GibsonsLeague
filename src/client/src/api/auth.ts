import axios from "axios";

const dataServiceRoot = process.env.REACT_APP_DATA_SERVICE;
const yahooAuthUrl = `${dataServiceRoot}/api/auth/yahoo`;

interface YahooAuthResponse {
    access_token: string
}

export async function yahooAuthAsync(code: string) {
    const url = `${yahooAuthUrl}?code=${code}&redirectUri=${process.env.REACT_APP_CALLBACK_URL}`;
    return axios.get<YahooAuthResponse>(url);
}