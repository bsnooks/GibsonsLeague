import axios from "axios";
import { PlayoffPool } from "../components/playoffPool/models/PlayoffPool";

const dataServiceRoot = process.env.REACT_APP_DATA_SERVICE;
const playoffPoolUrl = `${dataServiceRoot}/api/playoffpool`;

export function getPlayoffPool() {
    return axios.get<PlayoffPool>(playoffPoolUrl);
}