using GibsonsLeague.Core;
using GibsonsLeague.Core.Models;
using GibsonsLeague.Data.Repositories;
using GibsonsLeague.YahooSync.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GibsonsLeague.YahooSync
{

    /// <summary>
    /// Service to syncing data from Yahoo Fantasy API.
    /// </summary>
    public class YahooSyncService : IYahooSyncService
    {
        private readonly IConfiguration configuration;
        private readonly SeasonRepository seasonRepository;
        private readonly PlayerRepository playerRepository;
        private readonly DraftRepository draftRepository;
        private readonly TransactionRepository transactionRepository;
        private readonly MatchRepository matchRepository;

        /// <summary>
        /// Creates a new <see cref="YahooSyncService"/>
        /// </summary>
        /// <param name="configuration"></param>
        public YahooSyncService(IConfiguration configuration,
            SeasonRepository seasonRepository,
            PlayerRepository playerRepository,
            DraftRepository draftRepository,
            TransactionRepository transactionRepository,
            MatchRepository matchRepository)
        {
            this.configuration = configuration;
            this.seasonRepository = seasonRepository;
            this.playerRepository = playerRepository;
            this.draftRepository = draftRepository;
            this.transactionRepository = transactionRepository;
            this.matchRepository = matchRepository;
        }

        /// <summary>
        /// Sync the draft information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncDraft(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                var result = await client.GetAsync<YahooLeague>(
                    $"league/{season.YahooGameId}.l.{season.YahooLeagueId}/draftresults",
                    cancellationToken);

                if (result != null && result.DraftResults != null)
                {
                    int teams = 10;
                    int keeperCount = 50;
                    DateTime draftDate = DateTime.Parse(result.StartDate);

                    var draft = new Draft()
                    {
                        LeagueId = context.League.LeagueId,
                        Year = season.Year,
                        Date = draftDate,
                        Snake = true,
                        Rounds = ((result.DraftResults.DraftResult.Count - keeperCount) / teams),
                        DraftPicks = new List<DraftPick>()
                    };
                    var draftTransactions = new List<Transaction>();

                    var players = await playerRepository.GetPlayersBySeason(season.Year, season.Year - 1, season.Year - 2);

                    IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);
                    IDictionary<int, Player> playerCache = players.ToDictionary(p => p.YahooPlayerId.Value, p => p);
                    IDictionary<string, int> positionCounter = new Dictionary<string, int>();

                    foreach (var yahooPick in result.DraftResults.DraftResult.OrderBy(p => p.Pick))
                    {
                        int yahooPlayerId = int.Parse(yahooPick.PlayerKey.Replace($"{season.YahooGameId}.p.", ""));
                        int yahooTeamId = int.Parse(yahooPick.TeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""));

                        if (!playerCache.ContainsKey(yahooPlayerId))
                        {
                            playerCache.Add(yahooPlayerId, await SyncPlayer(client, season, yahooPlayerId, cancellationToken));
                        }

                        var player = playerCache[yahooPlayerId];
                        var team = teamCache[yahooTeamId];
                        int positionPick = -1;

                        if (!string.IsNullOrEmpty(player.PrimaryPosition))
                        {
                            if (!positionCounter.ContainsKey(player.PrimaryPosition))
                            {
                                positionCounter[player.PrimaryPosition] = 0;
                            }
                            positionPick = ++positionCounter[player.PrimaryPosition];
                        }

                        if (yahooPick.Pick > keeperCount)
                        {
                            draft.DraftPicks.Add(new DraftPick()
                            {
                                Round = yahooPick.Round - (keeperCount / teams),
                                Pick = yahooPick.Pick - keeperCount,
                                PositionPick = positionPick,
                                TeamId = team.TeamId,
                                PlayerId = player.PlayerId
                            });

                        }
                    }

                    await draftRepository.CreateDraft(draft);

                    foreach (var pick in draft.DraftPicks)
                    {
                        var team = teamCache.Values.FirstOrDefault(t => t.TeamId == pick.TeamId);
                        draftTransactions.Add(new Transaction()
                        {
                            TeamId = pick.TeamId,
                            TransactionType = TransactionType.DraftPicked,
                            PlayerId = pick.PlayerId,
                            Description = $"Drafted in round {pick.Round} ({pick.Pick} overall) by {team.Franchise.MainName}",
                            Year = season.Year,
                            Date = draftDate,
                            DraftPickId = pick.DraftPickId
                        });
                    }
                    await transactionRepository.CreateTransactions(draftTransactions);

                    season.DraftImported = true;
                    await seasonRepository.UpdateSeason(season);
                }
            }
        }

        /// <summary>
        /// Sync the transaction information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncTransactions(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                var result = await client.GetAsync<YahooLeague>(
                    $"league/{season.YahooGameId}.l.{season.YahooLeagueId}/transactions",
                    cancellationToken);

                if (result != null && result != null)
                {
                    var players = await playerRepository.GetPlayersBySeason(season.Year, season.Year - 1, season.Year - 2);

                    IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);
                    IDictionary<int, Player> playerCache = players.ToDictionary(p => p.YahooPlayerId.Value, p => p);

                    IList<Transaction> transactions = new List<Transaction>();
                    IList<TransactionGroup> transactionGroups = new List<TransactionGroup>();

                    foreach (var yahooTransaction in result.Transactions.Transactions.OrderBy(p => p.Timestamp))
                    {
                        DateTime transactionDate = DateTimeOffset.FromUnixTimeSeconds(long.Parse(yahooTransaction.Timestamp.ToString())).DateTime;

                        if (season.LastTransactionSyncDate.HasValue && transactionDate < season.LastTransactionSyncDate.Value)
                        {
                            // this transaction has already been synced
                            continue;
                        }

                        if (yahooTransaction.Status != "successful")
                        {
                            // this transaction was not successful and need not be synced
                            continue;
                        }

                        Team trader = null;
                        Team tradee = null;
                        IList<Player> traderPlayers = new List<Player>();
                        IList<Player> tradeePlayers = new List<Player>();

                        switch (yahooTransaction.Type)
                        {
                            case "add/drop":
                            case "add":
                            case "drop":
                                break;
                            case "trade":
                                trader = teamCache[int.Parse(yahooTransaction.TraderTeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""))];
                                tradee = teamCache[int.Parse(yahooTransaction.TradeeTeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""))];
                                break;
                            default:
                                // Not a supported yahoo transaction type
                                Console.WriteLine($"Unsupported yahoo transaction type {yahooTransaction.Type}");
                                continue;
                        }


                        TransactionGroup transactionGroup = yahooTransaction.PlayerList.Players.Count > 1 ?
                            new TransactionGroup()
                            {
                                TransactionGroupId = Guid.NewGuid(),
                                Date = transactionDate
                            } : null;
                        foreach (var playerTransaction in yahooTransaction.PlayerList.Players)
                        {
                            int yahooPlayerId = playerTransaction.PlayerId;

                            if (!playerCache.ContainsKey(yahooPlayerId))
                            {
                                playerCache.Add(yahooPlayerId, await SyncPlayer(client, season, yahooPlayerId, cancellationToken));
                            }

                            var player = playerCache[yahooPlayerId];

                            Team team;
                            TransactionType transactionType;
                            int yahooTeamId;
                            string description = "";
                            switch (playerTransaction.TransactionData.Type)
                            {
                                case "trade":
                                    transactionType = TransactionType.Traded;
                                    yahooTeamId = int.Parse(playerTransaction.TransactionData.DestinationTeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""));
                                    team = teamCache[yahooTeamId];
                                    break;
                                case "drop":
                                    transactionType = TransactionType.Dropped;
                                    yahooTeamId = int.Parse(playerTransaction.TransactionData.SourceTeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""));
                                    team = teamCache[yahooTeamId];
                                    description = $"Dropped by {team.Franchise.MainName}";
                                    break;
                                case "add":
                                default:
                                    transactionType = TransactionType.Added;
                                    yahooTeamId = int.Parse(playerTransaction.TransactionData.DestinationTeamKey.Replace($"{season.YahooGameId}.l.{season.YahooLeagueId}.t.", ""));
                                    team = teamCache[yahooTeamId];
                                    description = $"Added by {team.Franchise.MainName}";
                                    break;
                            }

                            if (tradee != null && tradee.TeamId == team.TeamId)
                            {
                                tradeePlayers.Add(player);
                            }
                            else if (trader != null && trader.TeamId == team.TeamId)
                            {
                                traderPlayers.Add(player);
                            }

                            var transaction = new Transaction()
                            {
                                Date = transactionDate,
                                PlayerId = player.PlayerId,
                                TransactionType = transactionType,
                                TeamId = team.TeamId,
                                Year = season.Year,
                                Description = description
                            };
                            if (transactionGroup != null)
                            {
                                transaction.TransactionGroupId = transactionGroup.TransactionGroupId;
                                transactionGroup.Transactions.Add(transaction);
                            }
                            else
                            {
                                transactions.Add(transaction);
                            }
                        }
                        if (yahooTransaction.Type == "trade" && transactionGroup != null)
                        {
                            foreach (var transaction in transactionGroup.Transactions)
                            {
                                var to = transaction.TeamId == trader.TeamId ? trader.Franchise.MainName : tradee.Franchise.MainName;
                                var from = transaction.TeamId == trader.TeamId ? tradee.Franchise.MainName : trader.Franchise.MainName;
                                var player = playerCache[transaction.PlayerId];
                                string withString = "";
                                string forString = "";
                                if (transaction.TeamId == trader.TeamId)
                                {
                                    forString = string.Join(", ", tradeePlayers.Select(p => p.Name));
                                    withString = string.Join(", ", traderPlayers.Where(p => p.PlayerId != transaction.PlayerId).Select(p => p.Name));
                                }
                                else
                                {
                                    forString = string.Join(", ", traderPlayers.Select(p => p.Name));
                                    withString = string.Join(", ", tradeePlayers.Where(p => p.PlayerId != transaction.PlayerId).Select(p => p.Name));
                                }
                                if (!string.IsNullOrEmpty(withString))
                                {
                                    withString = $" with {withString}";
                                }
                                transaction.Description = $"{from} traded {player.Name}{withString} to {to} for {forString}";
                                Console.WriteLine(transaction.Description);
                            }
                        }
                        if (transactionGroup != null)
                        {
                            transactionGroups.Add(transactionGroup);
                        }
                    }

                    await transactionRepository.CreateTransactionGroups(transactionGroups);
                    await transactionRepository.CreateTransactions(transactions);

                    season.LastTransactionSyncDate = DateTime.Now;
                    await seasonRepository.UpdateSeason(season);
                }
            }
        }

        protected async Task<Player> SyncPlayer(YahooClient client, Season season, int yahooPlayerId, CancellationToken cancellationToken)
        {
            var yahooPlayer = await client.GetAsync<YahooPlayer>(
                $"player/{season.YahooGameId}.p.{yahooPlayerId}",
                cancellationToken);
            var newPlayer = new Player()
            {
                PlayerId = yahooPlayerId,
                YahooPlayerId = yahooPlayerId,
                Name = yahooPlayer.Name.Full,
                PrimaryPosition = yahooPlayer.DisplayPosition.Length > 2 ? yahooPlayer.DisplayPosition.Substring(0, 2) : yahooPlayer.DisplayPosition,
                Position = yahooPlayer.DisplayPosition,
                PlayerSeasons = new List<PlayerSeason>()
                                {
                                    new PlayerSeason()
                                    {
                                         Year = season.Year,
                                         Points = 0,
                                         PositionRank = 0,
                                         PositionRankPpg = 0,
                                         GamesPlayed = 0,
                                    }
                                }
            };

            await playerRepository.CreatePlayer(newPlayer);

            Console.WriteLine($"Added {newPlayer.Name} ({newPlayer.PrimaryPosition}): {yahooPlayerId}");

            return newPlayer;
        }

        /// <summary>
        /// Sync the matchup information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncMatchups(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                int week = season.MatchupSyncWeek.HasValue ? season.MatchupSyncWeek.Value + 1 : 1;
                bool validWeek = true;
                while (validWeek)
                {
                    var result = await client.GetAsync<YahooLeague>(
                        $"league/{season.YahooGameId}.l.{season.YahooLeagueId}/scoreboard;week={week}",
                        cancellationToken);

                    if (result != null && result != null)
                    {
                        validWeek = week <= result.CurrentWeek;
                        if (!validWeek)
                        {
                            continue;
                        }
                        IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);

                        IList<Match> matches = new List<Match>();
                        IList<TeamScore> teamScores = new List<TeamScore>();
                        foreach (var yahooMatchup in result.Scoreboard.Matchups.Matchups)
                        {
                            if (yahooMatchup.Status != "postevent")
                            {
                                continue;
                            }
                            var matchType = yahooMatchup.IsPlayoffs ? MatchType.Playoff : yahooMatchup.IsConsolation ? MatchType.Consolation : MatchType.Regular;
                            if (matchType == MatchType.Playoff && week == (season.Year >= 2021 ? 16 : 15))
                            {
                                matchType = MatchType.Championship;
                            }

                            Team winningTeam = null;
                            Team losingTeam = null;
                            foreach (var yahooTeamScore in yahooMatchup.Teams.Teams)
                            {
                                var team = teamCache[yahooTeamScore.TeamId];
                                if (yahooTeamScore.TeamKey == yahooMatchup.WinnerTeamKey)
                                {
                                    winningTeam = team;
                                }
                                else
                                {
                                    if (losingTeam != null && yahooMatchup.IsTied)
                                    {
                                        winningTeam = team;
                                    }
                                    else
                                    {
                                        losingTeam = team;
                                    }
                                }
                                var teamScore = new TeamScore()
                                {
                                    LeagueId = context.League.LeagueId,
                                    Year = season.Year,
                                    Week = week,
                                    Points = yahooTeamScore.TeamPoints.Total,
                                    ProjectedPoints = yahooTeamScore.TeamProjectedPoints.Total,
                                    TeamId = team.TeamId
                                };
                                teamScores.Add(teamScore);
                            }

                            var matchup = new Match()
                            {
                                LeagueId = context.League.LeagueId,
                                Year = season.Year,
                                Week = week,
                                MatchTypeId = matchType,
                                Tied = yahooMatchup.IsTied,
                                WinningTeamId = winningTeam.TeamId,
                                LosingTeamId = losingTeam.TeamId
                            };
                            matches.Add(matchup);
                        }

                        await matchRepository.CreateMatches(matches, teamScores);

                        season.MatchupSyncWeek = week;
                        await seasonRepository.UpdateSeason(season);
                        week++;
                    }
                }
            }
        }

        /// <summary>
        /// Sync the standings information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncStandings(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                var result = await client.GetAsync<YahooLeague>(
                    $"league/{season.YahooGameId}.l.{season.YahooLeagueId}/standings",
                    cancellationToken);

                if (result != null && result != null)
                {
                    IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);

                    IList<Match> matches = new List<Match>();
                    IList<TeamScore> teamScores = new List<TeamScore>();
                    foreach (var yahooStanding in result.Standings.TeamList.Teams)
                    {
                        var team = teamCache[yahooStanding.TeamId];
                        team.Standing = yahooStanding.TeamStandings.Rank;
                        team.Points = yahooStanding.TeamStandings.PointsFor;
                        team.Wins = yahooStanding.TeamStandings.OutcomeTotals.Wins;
                        team.Loses = yahooStanding.TeamStandings.OutcomeTotals.Losses;
                        team.Ties = yahooStanding.TeamStandings.OutcomeTotals.Ties;
                    }

                    await seasonRepository.UpdateSeason(season);
                }
            }
        }

        /// <summary>
        /// Sync the player stats information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncPlayerStats(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                var players = await playerRepository.GetPlayerSeasons(season.Year, new[] { "QB", "RB", "WR", "TE" });
                IDictionary<int, PlayerSeason> playerCache = players.ToDictionary(p => p.PlayerId, p => p);

                var batches = players.ToList().SplitList(25);

                foreach (var batch in batches)
                {
                    var keys = string.Join(",", batch.Select(p => $"{season.YahooGameId}.p.{p.PlayerId}"));
                    YahooPlayerList result = null;

                    try
                    {
                        result = await client.GetAsync<YahooPlayerList>(
                            $"players//stats?player_keys={keys}",
                            cancellationToken);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }

                    if (result != null && result != null)
                    {
                        IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);

                        foreach (var yahooPlayer in result.Players)
                        {
                            var playerSeason = playerCache[yahooPlayer.PlayerId];
                            if (playerSeason != null)
                            {
                                Console.WriteLine($"Updating: {yahooPlayer.Name.Full}");
                                playerSeason.GamesPlayed = yahooPlayer.PlayerStats.Stats.GetStatValue(YahooStatType.GamesPlayed);
                                playerSeason.Points = yahooPlayer.PlayerStats.Stats.CalculatePoints();
                            }
                        }
                    }
                }

                await playerRepository.UpdatePlayersSeasons(players, season.Year);
            }
        }

        /// <summary>
        /// Sync the player roster information for a season between Yahoo! and GLA.
        /// </summary>
        /// <param name="context"></param>
        /// <param name="season"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task SyncPlayerRoster(ISyncContext context, Season season, CancellationToken cancellationToken = default)
        {
            using (var client = new YahooClient(context, configuration))
            {
                var playerSeasons = await playerRepository.GetPlayerSeasons(season.Year, new[] { "QB", "RB", "WR", "TE" });

                // reset players teams.
                foreach(var player in playerSeasons)
                {
                    player.EndTeamId = null;
                }

                IDictionary<int, PlayerSeason> playerCache = playerSeasons.ToDictionary(p => p.PlayerId, p => p);
                IDictionary<int, Team> teamCache = season.Teams.ToDictionary(s => s.YahooTeamId.Value, s => s);

                foreach (var team in season.Teams)
                {
                    YahooTeam result = null;
                    try
                    {
                        result = await client.GetAsync<YahooTeam>(
                            $"team/{season.YahooGameId}.l.{season.YahooLeagueId}.t.{team.YahooTeamId}/roster",
                            cancellationToken);
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e.Message);
                    }

                    if (result != null && result != null)
                    {
                        foreach (var yahooPlayer in result.Roster.PlayerList.Players)
                        {
                            if (playerCache.ContainsKey(yahooPlayer.PlayerId))
                            {
                                var playerSeason = playerCache[yahooPlayer.PlayerId];
                                Console.WriteLine($"Updating: {yahooPlayer.Name.Full} to be on {team.Franchise.MainName}");
                                playerSeason.EndTeamId = team.TeamId;
                            }
                        }
                    }
                }

                await playerRepository.UpdatePlayersSeasons(playerSeasons, season.Year, false);
            }
        }

    }
}
