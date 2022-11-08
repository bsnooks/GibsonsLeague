import React from 'react';
import { Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faYahoo } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GlobalLoading from '../components/GlobalLoading';
import { GibsonsLeagueQuery, Season } from '../generated/graphql';
import GlobalError from '../components/GlobalError';
import { yahooSyncDraft, yahooSyncMatchups, yahooSyncPlayerStats, yahooSyncRosters, yahooSyncStandings, yahooSyncTransactions } from '../api/yahooSync';
import SyncButton from '../components/controls/SyncButton';
import { useHistory } from 'react-router';
import { useAuthContext } from '../components/auth/hooks/useAuthContext';

export const GET_SEASONS = gql`
  query GibsonsLeagueQuery {
    league {
      leagueId
      seasons
      {
        year
        yahooLeagueId
        yahooGameId
        finished
        draftImported
        keepersSet
        matchupSyncWeek
        lastTransactionSyncDate
      }
    }
  }
`;
interface YahooSyncProps { }

const YahooSync: React.FC<YahooSyncProps> = () => {
    const { token } = useAuthContext();
    const history = useHistory();

    const {
        data,
        loading,
        error
    } = useQuery<GibsonsLeagueQuery>(GET_SEASONS);

    if (!token) {
        history.push('/callback')
    }
    if (loading) return <GlobalLoading mode="page" />;
    if (error || !data) return <GlobalError mode="page" apolloError={error} />;
    const leagueId = data.league?.leagueId ?? "";

    const syncDraft = (season: Season) => {
        yahooSyncDraft(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    const syncTransactions = (season: Season) => {
        yahooSyncTransactions(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    const syncMatchups = (season: Season) => {
        yahooSyncMatchups(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    const syncStandings = (season: Season) => {
        yahooSyncStandings(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    const syncPlayerStats = (season: Season) => {
        yahooSyncPlayerStats(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    const syncRosters = (season: Season) => {
        yahooSyncRosters(
            leagueId,
            season.year,
            (response) => console.log(response),
            (err) => console.log(err));
    }

    return (
        <div className="page">
            <Container>
                {
                    data.league?.seasons?.slice().sort((a,b) => ((a?.year ?? 0) > (b?.year ?? 0)) ? -1 : 1).map((season: any) => (
                        <div key={season.year}>
                            <div className="section-title">
                                <span>{season.year} Season Sync</span>
                            </div>
                            <div className="section-body p-3">
                                <div className="text-left">
                                    <a target="_blank" rel="noreferrer" href={`${ season.finished ? `https://football.fantasysports.yahoo.com/league/gibsonsleague/${season.year}` : season.yahooLeagueId ? `https://football.fantasysports.yahoo.com/f1/${season.yahooLeagueId}` : null }`}><FontAwesomeIcon icon={faYahoo} /> Fantasy League <FontAwesomeIcon icon={faExternalLinkAlt} /></a>
                                </div>
                                <div className="seasonsync-list">
                                    <div className="seasonsync-headings">
                                        <div className="seasonsync-col status">Status</div>
                                        <div className="seasonsync-col data">Data</div>
                                        <div className="seasonsync-col date">Last Updated</div>
                                    </div>
                                    <div className="seasonsync">
                                        <div className="seasonsync-col status">
                                            <SyncButton onSyncClick={() => {}} synced={season.keepersSet} season={season} />
                                        </div>
                                        <div className="seasonsync-col data">Keepers</div>
                                        <div className="seasonsync-col date">{season.keepersSet ? "" : "Never"}</div>
                                    </div>
                                    <div className="seasonsync">
                                        <div className="seasonsync-col status">
                                            <SyncButton onSyncClick={(_, season) => syncDraft(season)} synced={season.draftImported} season={season} import={true} />
                                        </div>
                                        <div className="seasonsync-col data">Draft</div>
                                        <div className="seasonsync-col date">{season.draftImported ? "" : "Never"}</div>
                                    </div>
                                    <div className="seasonsync">
                                        <div className="seasonsync-col status">
                                            <SyncButton onSyncClick={(_, season) => syncTransactions(season)} synced={season.finished} season={season} />
                                        </div>
                                        <div className="seasonsync-col data">Transactions</div>
                                        <div className="seasonsync-col date">{season.finished ? "" : season.lastTransactionSyncDate ? new Date(season.lastTransactionSyncDate).toLocaleDateString() : "Never"}</div>
                                    </div>
                                    <div className="seasonsync">
                                        <div className="seasonsync-col status">
                                            <SyncButton onSyncClick={(_, season) => syncMatchups(season)} synced={season.finished} season={season} />
                                        </div>
                                        <div className="seasonsync-col data">Matchups</div>
                                        <div className="seasonsync-col date">{season.matchupSyncWeek ? `Week ${season.matchupSyncWeek}` : "Never"}</div>
                                    </div>
                                    { !season.finished ? (<>
                                        <div className="seasonsync">
                                            <div className="seasonsync-col status">
                                                <SyncButton onSyncClick={(_, season) => syncStandings(season)} synced={season.finished} season={season} />
                                            </div>
                                            <div className="seasonsync-col data">Standings</div>
                                            <div className="seasonsync-col date"></div>
                                        </div>
                                        <div className="seasonsync">
                                            <div className="seasonsync-col status">
                                                <SyncButton onSyncClick={(_, season) => syncPlayerStats(season)} synced={season.finished} season={season} />
                                            </div>
                                            <div className="seasonsync-col data">Player Stats</div>
                                            <div className="seasonsync-col date"></div>
                                        </div>
                                        <div className="seasonsync">
                                            <div className="seasonsync-col status">
                                                <SyncButton onSyncClick={(_, season) => syncRosters(season)} synced={season.finished} season={season} />
                                            </div>
                                            <div className="seasonsync-col data">Rosters</div>
                                            <div className="seasonsync-col date"></div>
                                        </div>
                                    </>) :null}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </Container>
        </div>
    );
}

export default YahooSync;

