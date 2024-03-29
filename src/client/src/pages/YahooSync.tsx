import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faYahoo } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GlobalLoading, GlobalError } from "../components/ui";
import { GibsonsLeagueQuery, Season } from "../generated/graphql";
import {
  yahooSyncDraft,
  yahooSyncKeepers,
  yahooSyncMatchups,
  yahooSyncPlayerStats,
  yahooSyncPlayerWeeklyStats,
  yahooSyncRosters,
  yahooSyncStandings,
  yahooSyncTransactions,
  yahooSyncWeeklyRosters,
  yahooSyncCurrentWeek,
} from "../api/yahooSync";
import SyncButton from "../components/controls/SyncButton";
import { useHistory } from "react-router";
import { useAuthContext } from "../components/auth/hooks/useAuthContext";
import { useYahooToken } from "../components/sync/hooks/useYahooToken";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { toast } from "react-toastify";

const signalRAddress = `${process.env.REACT_APP_DATA_SERVICE}/yahoosync`;

export const GET_SEASONS = gql`
  query GibsonsLeagueQuery {
    league {
      leagueId
      seasons {
        year
        yahooLeagueId
        yahooGameId
        finished
        draftImported
        keepersSet
        currentWeek
        matchupSyncWeek
        weekStatsSyncWeek
        weeklyRosterSyncWeek
        lastTransactionSyncDate
      }
    }
  }
`;

let connection: HubConnection;

interface YahooSyncProps {}

const YahooSync: React.FC<YahooSyncProps> = () => {
  // hooks
  const { token } = useAuthContext();
  const history = useHistory();
  useYahooToken();

  // queries
  const { data, loading, error, refetch } = useQuery<GibsonsLeagueQuery>(GET_SEASONS);

  // Component mounting
  useEffect(() => {
    connection = new HubConnectionBuilder()
      .withUrl(signalRAddress)
      .build();

    connection.on("SeasonSyncComplete", (year: number, type: string, message: string) => {
      console.log("SignalR", year, type, message);
      refetch();
      toast.success(message);
    });

    connection.start();

    // destructor
    return () => {
      connection.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!token) {
    history.push("/callback");
  }
  if (loading) return <GlobalLoading mode="page" />;
  if (error || !data) return <GlobalError mode="page" apolloError={error} />;
  const leagueId = data.league?.leagueId ?? "";

  const syncCurrentWeek = (season: Season) => {
    yahooSyncCurrentWeek(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncKeepers = (season: Season) => {
    yahooSyncKeepers(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncDraft = (season: Season) => {
    yahooSyncDraft(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncTransactions = (season: Season) => {
    yahooSyncTransactions(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncMatchups = (season: Season) => {
    yahooSyncMatchups(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncStandings = (season: Season) => {
    yahooSyncStandings(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncPlayerStats = (season: Season) => {
    yahooSyncPlayerStats(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncPlayerWeeklyStats = (season: Season) => {
    yahooSyncPlayerWeeklyStats(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncRosters = (season: Season) => {
    yahooSyncRosters(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  const syncWeeklyRosters = (season: Season) => {
    yahooSyncWeeklyRosters(
      leagueId,
      season.year,
      (response) => console.log(response),
      (err) => console.log(err)
    );
  };

  return (
    <div className="page">
      <Container>
        {data.league?.seasons
          ?.slice()
          .sort((a, b) => ((a?.year ?? 0) > (b?.year ?? 0) ? -1 : 1))
          .map((season: any) => (
            <div key={season.year}>
              <div className="section-title">
                <span>{season.year} Season Sync</span>
              </div>
              <div className="section-body p-3">
                <div className="text-left">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`${
                      season.finished
                        ? `https://football.fantasysports.yahoo.com/league/gibsonsleague/${season.year}`
                        : season.yahooLeagueId
                        ? `https://football.fantasysports.yahoo.com/f1/${season.yahooLeagueId}`
                        : null
                    }`}
                  >
                    <FontAwesomeIcon icon={faYahoo} /> Fantasy League{" "}
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                </div>
                <div className="seasonsync-list">
                  <div className="seasonsync-headings">
                    <div className="seasonsync-col status">Status</div>
                    <div className="seasonsync-col data">Data</div>
                    <div className="seasonsync-col date">Last Updated</div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncCurrentWeek(season)}
                        synced={season.finished}
                        season={season}
                        type="add"
                      />
                    </div>
                    <div className="seasonsync-col data">Current Week</div>
                    <div className="seasonsync-col date">{`Week ${season.currentWeek}`}</div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncKeepers(season)}
                        synced={season.keepersSet}
                        season={season}
                        type="import"
                      />
                    </div>
                    <div className="seasonsync-col data">Keepers</div>
                    <div className="seasonsync-col date">
                      {season.keepersSet ? "" : "Never"}
                    </div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncDraft(season)}
                        synced={season.draftImported}
                        season={season}
                        type="import"
                      />
                    </div>
                    <div className="seasonsync-col data">Draft</div>
                    <div className="seasonsync-col date">
                      {season.draftImported ? "" : "Never"}
                    </div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncTransactions(season)}
                        synced={season.finished}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">Transactions</div>
                    <div className="seasonsync-col date">
                      {season.finished
                        ? ""
                        : season.lastTransactionSyncDate
                        ? `${new Date(season.lastTransactionSyncDate).toLocaleDateString()} ${new Date(season.lastTransactionSyncDate).toLocaleTimeString()}`
                        : "Never"}
                    </div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncStandings(season)}
                        synced={season.finished}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">Standings</div>
                    <div className="seasonsync-col date"></div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncPlayerStats(season)}
                        synced={season.finished}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">
                      Player Season Stats
                    </div>
                    <div className="seasonsync-col date"></div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncRosters(season)}
                        synced={season.finished}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">Rosters</div>
                    <div className="seasonsync-col date"></div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncMatchups(season)}
                        synced={season.matchupSyncWeek === season.currentWeek}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">Matchups</div>
                    <div className="seasonsync-col date">
                      {season.matchupSyncWeek
                        ? `Week ${season.matchupSyncWeek}`
                        : "Never"}
                    </div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) =>
                          syncPlayerWeeklyStats(season)
                        }
                        synced={season.weekStatsSyncWeek === season.currentWeek}
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">
                      Player Weekly Stats
                    </div>
                    <div className="seasonsync-col date">
                      {season.weekStatsSyncWeek
                        ? `Week ${season.weekStatsSyncWeek}`
                        : "Never"}
                    </div>
                  </div>
                  <div className="seasonsync">
                    <div className="seasonsync-col status">
                      <SyncButton
                        onSyncClick={(_, season) => syncWeeklyRosters(season)}
                        synced={
                          season.weeklyRosterSyncWeek === season.currentWeek
                        }
                        season={season}
                      />
                    </div>
                    <div className="seasonsync-col data">Weekly Rosters</div>
                    <div className="seasonsync-col date">
                      {season.weeklyRosterSyncWeek
                        ? `Week ${season.weeklyRosterSyncWeek}`
                        : "Never"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </Container>
    </div>
  );
};

export default YahooSync;
