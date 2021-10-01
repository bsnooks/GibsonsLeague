import axios, { AxiosError } from "axios";

const dataServiceRoot = process.env.REACT_APP_DATA_SERVICE;
const yahooSyncUrl = `${dataServiceRoot}/api/yahoosync`;

export function yahooSyncDraft(leagueId: string, year: number, onSuccess: (response: any) => any, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooSyncUrl}/draft`;
        axios.post(url,
            {
                Year: year,
                LeagueId: leagueId
            })
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}

export function yahooSyncMatchups(leagueId: string, year: number, onSuccess: (response: any) => any, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooSyncUrl}/matchups`;
        axios.post(url,
            {
                Year: year,
                LeagueId: leagueId
            })
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}

export function yahooSyncTransactions(leagueId: string, year: number, onSuccess: (response: any) => any, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooSyncUrl}/transactions`;
        axios.post(url,
            {
                Year: year,
                LeagueId: leagueId
            })
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}

export function yahooSyncStandings(leagueId: string, year: number, onSuccess: (response: any) => any, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooSyncUrl}/standings`;
        axios.post(url,
            {
                Year: year,
                LeagueId: leagueId
            })
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}

export function yahooSyncPlayerStats(leagueId: string, year: number, onSuccess: (response: any) => any, onError: ((reason: any) => void)) {
    try {
        const url = `${yahooSyncUrl}/playerstats`;
        axios.post(url,
            {
                Year: year,
                LeagueId: leagueId
            })
            .then(response => onSuccess(response.data))
            .catch((err: Error | AxiosError) => {
                onError(err);
            })

    } catch (err) {
        return null;
    }
}