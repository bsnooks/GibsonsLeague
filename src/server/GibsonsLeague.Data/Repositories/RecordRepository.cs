using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GibsonsLeague.Data.Models;

namespace GibsonsLeague.Data.Repositories
{
    public class RecordRepository
    {
        private readonly Func<GLAContext> dbFunc;

        public RecordRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<LeagueRecords>> GetLeagueRecords(Guid leagueId, int number, bool? recordPositivity = null, RecordType? recordType = null)
        {
            using (var dbContext = dbFunc())
            {
                IList<LeagueRecords> recordCollection = new List<LeagueRecords>();

                if (!recordPositivity.HasValue || recordPositivity.Value)
                {
                    if (!recordType.HasValue || recordType == RecordType.Franchise)
                    {
                        IList<FranchiseStats> franchiseStats = await dbContext.Franchises
                                    .Where(x => x.LeagueId == leagueId)
                                    .Include(x => x.Teams)
                                    .Select(x => new FranchiseStats()
                                    {
                                        Franchise = x,
                                        Wins = x.Teams.Sum(t => t.Wins),
                                        Loses = x.Teams.Sum(t => t.Loses),
                                        Ties = x.Teams.Sum(t => t.Ties),
                                        Points = x.Teams.Sum(t => t.Points),
                                        Championships = x.Teams.Count(t => t.Champion),
                                        WinningSeasons = x.Teams.Count(t => t.Wins > t.Loses)
                                    })
                                    .ToListAsync();

                        recordCollection.Add(
                            CreateFranchiseRecord("Most Championships",
                                franchiseStats.OrderByDescending(x => x.Championships).ThenByDescending(x => x.Wins).Take(number).ToList(),
                                recordValueType: FranchiseRecordValueType.Championships));

                        recordCollection.Add(
                            CreateFranchiseRecord("Most Winning Seasons",
                                franchiseStats.OrderByDescending(x => x.WinningSeasons).ThenByDescending(x => x.Wins).Take(number).ToList(),
                                recordValueType: FranchiseRecordValueType.WinningSeasons));

                        recordCollection.Add(
                            CreateFranchiseRecord("Most Wins",
                                franchiseStats.OrderByDescending(x => x.Wins).ThenByDescending(x => x.Championships).Take(number).ToList(),
                                recordValueType: FranchiseRecordValueType.Wins));

                        recordCollection.Add(
                            CreateFranchiseRecord("Most Franchise Points",
                                franchiseStats.OrderByDescending(x => x.Points).ThenByDescending(x => x.Championships).Take(number).ToList(),
                                recordValueType: FranchiseRecordValueType.Points));

                        recordCollection.Add(
                            CreateFranchiseRecord("Most Times Player Kept",
                                dbContext.Transactions
                                    .Where(x => x.TransactionType == TransactionType.Kept)
                                    .Include(x => x.Team).ThenInclude(x => x.Franchise)
                                    .Include(x => x.Player)
                                    // this makes me sad.
                                    .ToList()
                                    .GroupBy(x => new { x.PlayerId, x.Player.Name, x.Team.Franchise })
                                    .Select(x => new {
                                        Franchise = x.Key.Franchise,
                                        Name = x.Key.Name,
                                        Count = x.Count()
                                    })
                                    .OrderByDescending(x=> x.Count)
                                    .Take(number)
                                    .Select(x => new FranchiseStats()
                                    {
                                        Franchise = x.Franchise,
                                        OtherRecord = $"{x.Name} ({x.Count})",
                                        OtherRecordValue = x.Count
                                    })
                                    .ToList(),
                                recordValueType: FranchiseRecordValueType.OtherRecord));
                    }

                    if (!recordType.HasValue || recordType == RecordType.Season)
                    {
                        recordCollection.Add(
                            CreateTeamRecord("Best Record",
                                await dbContext.Teams
                                    .Where(x => x.LeagueId == leagueId)
                                    .OrderByDescending(x => x.Wins)
                                    .ThenByDescending(x => x.Ties)
                                    .ThenByDescending(x => x.Points)
                                    .Include(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                true,
                                RecordType.Season));

                        recordCollection.Add(
                            CreateTeamRecord("Season Points",
                                await dbContext.Teams
                                    .Where(x => x.LeagueId == leagueId)
                                    .OrderByDescending(x => x.Points)
                                    .Include(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                true,
                                RecordType.Season,
                                TeamRecordValueType.Points));
                    }

                    if (!recordType.HasValue || recordType == RecordType.Match)
                    {
                        recordCollection.Add(
                            CreateTeamScoreRecord("Most Points",
                                await dbContext.TeamScores
                                    .Where(x => x.LeagueId == leagueId)
                                    .OrderByDescending(x => x.Points)
                                    .Include(x => x.Team)
                                    .ThenInclude(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                true,
                                RecordType.Match));

                        recordCollection.Add(
                            CreateMatchResultRecord("Biggest Blowouts",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderByDescending(x => x.WinnerPoints - x.LoserPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync()));

                        recordCollection.Add(
                            CreateMatchResultRecord("Closest Wins",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderBy(x => x.WinnerPoints - x.LoserPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync()));

                        recordCollection.Add(
                            CreateMatchResultRecord("Highest Combined Points",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderByDescending(x => x.WinnerPoints + x.LoserPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync(),
                                recordValueType: MatchResultRecordType.Combined));

                        recordCollection.Add(
                            CreateMatchResultRecord("Lowest Combined Points",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderBy(x => x.WinnerPoints + x.LoserPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync(),
                                recordValueType: MatchResultRecordType.Combined));

                        recordCollection.Add(
                            CreateMatchResultRecord("Lowest Point Win",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderBy(x => x.WinnerPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync(),
                                recordValueType: MatchResultRecordType.Winner));

                        recordCollection.Add(
                            CreateMatchResultRecord("Highest Point Loss",
                                await dbContext.Matches
                                    .Where(x => x.LeagueId == leagueId)
                                    .Select(x => new MatchResult
                                    {
                                        Year = x.Year,
                                        Week = x.Week,
                                        Winner = x.WinningTeam.Franchise,
                                        WinnerPoints = x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Loser = x.LosingTeam.Franchise,
                                        LoserPoints = x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week && s.Year == x.Year).Points,
                                        Tied = x.Tied
                                    })
                                    .OrderByDescending(x => x.LoserPoints)
                                    .ThenBy(x => x.Year)
                                    .Take(number)
                                    .ToListAsync(),
                                recordValueType: MatchResultRecordType.Loser));

                        recordCollection.Add(
                            CreateTeamScoreRecord("High Projection Exceeded",
                                await dbContext.TeamScores
                                    .Where(x => x.LeagueId == leagueId && x.ProjectedPoints.HasValue && x.ProjectedPoints.Value != 0)
                                    .OrderByDescending(x => x.Points - x.ProjectedPoints)
                                    .Include(x => x.Team)
                                    .ThenInclude(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                true,
                                RecordType.Match,
                                TeamScoreRecordValueType.ProjectedPointsDifference));

                        recordCollection.Add(
                            CreateTeamScoreRecord("Highest Projection",
                                await dbContext.TeamScores
                                    .Where(x => x.LeagueId == leagueId)
                                    .OrderByDescending(x => x.ProjectedPoints)
                                    .Include(x => x.Team)
                                    .ThenInclude(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                true,
                                RecordType.Match,
                                TeamScoreRecordValueType.ProjectedPoints));
                    }

                    if (!recordType.HasValue || recordType == RecordType.Player)
                    {
                    }
                }

                if (!recordPositivity.HasValue || !recordPositivity.Value)
                {
                    if (!recordType.HasValue || recordType == RecordType.Franchise)
                    {
                    }
                    if (!recordType.HasValue || recordType == RecordType.Season)
                    {
                        recordCollection.Add(
                            CreateTeamRecord("Worst Record",
                                await dbContext.Teams
                                    .Where(x => x.LeagueId == leagueId)
                                    .OrderByDescending(x => x.Loses)
                                    .ThenBy(x => x.Ties)
                                    .ThenBy(x => x.Points)
                                    .Include(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                false,
                                RecordType.Season));
                    }
                    if (!recordType.HasValue || recordType == RecordType.Match)
                    {
                        recordCollection.Add(
                        CreateTeamScoreRecord("Least Points",
                            await dbContext.TeamScores
                                .Where(x => x.LeagueId == leagueId)
                                .OrderBy(x => x.Points)
                                .Include(x => x.Team)
                                .ThenInclude(x => x.Franchise)
                                .Take(number)
                                .ToListAsync(),
                            false,
                            RecordType.Match));

                        recordCollection.Add(
                            CreateTeamScoreRecord("Lowest Projection",
                                await dbContext.TeamScores
                                    .Where(x => x.LeagueId == leagueId && x.ProjectedPoints.HasValue && x.ProjectedPoints.Value != 0)
                                    .OrderBy(x => x.ProjectedPoints)
                                    .Include(x => x.Team)
                                    .ThenInclude(x => x.Franchise)
                                    .Take(number)
                                    .ToListAsync(),
                                false,
                                RecordType.Match,
                                TeamScoreRecordValueType.ProjectedPoints));
                    }

                    if (!recordType.HasValue || recordType == RecordType.Player)
                    {
                    }
                }

                return recordCollection;
            }
        }

        private LeagueRecords CreateFranchiseRecord(string title, ICollection<FranchiseStats> franchisesStats,
            FranchiseRecordValueType recordValueType = FranchiseRecordValueType.Points,
            bool positiveRecord = true)
        {
            LeagueRecords record = new LeagueRecords()
            {
                RecordTitle = title,
                PositiveRecord = positiveRecord,
                RecordType = RecordType.Franchise,
                Records = new List<LeagueRecord>()
            };

            var count = 1;
            foreach (var franchiseStats in franchisesStats)
            {
                string recordValue = "";
                double recordNumericValue;
                switch (recordValueType)
                {
                    case FranchiseRecordValueType.Championships:
                        recordValue = franchiseStats.Championships.ToString();
                        recordNumericValue = franchiseStats.Championships;
                        break;
                    case FranchiseRecordValueType.WinningSeasons:
                        recordValue = franchiseStats.WinningSeasons.ToString();
                        recordNumericValue = franchiseStats.WinningSeasons;
                        break;
                    case FranchiseRecordValueType.Loses:
                        recordValue = franchiseStats.Loses.ToString();
                        recordNumericValue = franchiseStats.Loses;
                        break;
                    case FranchiseRecordValueType.Wins:
                        recordValue = franchiseStats.Wins.ToString();
                        recordNumericValue = franchiseStats.Wins;
                        break;
                    case FranchiseRecordValueType.Points:
                        recordValue = franchiseStats.Points.ToString("0.##");
                        recordNumericValue = franchiseStats.Points;
                        break;
                    case FranchiseRecordValueType.OtherRecord:
                    default:
                        recordValue = franchiseStats.OtherRecord;
                        recordNumericValue = franchiseStats.OtherRecordValue;
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = franchiseStats.Franchise,
                    RecordValue = recordValue,
                    RecordNumericValue = recordNumericValue
                });
            }
            return record;
        }

        private LeagueRecords CreateTeamRecord(string title, ICollection<Team> teams,
            bool positiveRecord = true,
            RecordType recordType = RecordType.Match,
            TeamRecordValueType recordValueType = TeamRecordValueType.Record)
        {
            LeagueRecords record = new LeagueRecords()
            {
                RecordTitle = title,
                PositiveRecord = positiveRecord,
                RecordType = recordType,
                Records = new List<LeagueRecord>()
            };

            var count = 1;
            foreach (var team in teams)
            {
                string recordValue = "";
                double recordNumericValue;
                switch (recordValueType)
                {
                    case TeamRecordValueType.Loses:
                        recordValue = team.Loses.ToString();
                        recordNumericValue = team.Loses;
                        break;
                    case TeamRecordValueType.Wins:
                        recordValue = team.Wins.ToString();
                        recordNumericValue = team.Wins;
                        break;
                    case TeamRecordValueType.Points:
                        recordValue = team.Points.ToString("0.##");
                        recordNumericValue = team.Points;
                        break;
                    case TeamRecordValueType.Record:
                    default:
                        recordValue = $"{team.Wins}-{team.Loses}-{team.Ties}";
                        recordNumericValue = team.Wins;
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = team.Franchise,
                    RecordValue = recordValue,
                    RecordNumericValue = recordNumericValue,
                    Year = team.Year
                });
            }
            return record;
        }

        private LeagueRecords CreateTeamScoreRecord(string title, ICollection<TeamScore> scores,
            bool positiveRecord = true,
            RecordType recordType = RecordType.Match,
            TeamScoreRecordValueType recordValueType = TeamScoreRecordValueType.Points)
        {
            LeagueRecords record = new LeagueRecords()
            {
                RecordTitle = title,
                PositiveRecord = positiveRecord,
                RecordType = recordType,
                Records = new List<LeagueRecord>()
            };

            var count = 1;
            foreach (var score in scores)
            {
                string recordValue;
                double recordNumericValue;
                switch (recordValueType)
                {
                    case TeamScoreRecordValueType.ProjectedPoints:
                        recordValue = score.ProjectedPoints.Value.ToString("0.##");
                        recordNumericValue = score.ProjectedPoints.Value;
                        break;
                    case TeamScoreRecordValueType.ProjectedPointsDifference:
                        recordValue = $"{(score.Points - score.ProjectedPoints.Value).ToString("0.##")} ({score.Points.ToString("0.##") } vs {score.ProjectedPoints.Value.ToString("0.##")})";
                        recordNumericValue = score.Points - score.ProjectedPoints.Value;
                        break;
                    case TeamScoreRecordValueType.Points:
                    default:
                        recordValue = score.Points.ToString("0.##");
                        recordNumericValue = score.Points;
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = score.Team.Franchise,
                    RecordValue = recordValue,
                    RecordNumericValue = recordNumericValue,
                    Year = score.Year,
                    Week = score.Week
                });
            }
            return record;
        }

        private LeagueRecords CreateMatchResultRecord(string title, ICollection<MatchResult> results,
            bool positiveRecord = true,
            MatchResultRecordType recordValueType = MatchResultRecordType.Difference,
            RecordType recordType = RecordType.Match)
        {
            LeagueRecords record = new LeagueRecords()
            {
                RecordTitle = title,
                PositiveRecord = positiveRecord,
                RecordType = recordType,
                Records = new List<LeagueRecord>()
            };

            var count = 1;
            foreach (var result in results)
            {
                string recordValue;
                double recordNumericValue;
                switch (recordValueType)
                {
                    case MatchResultRecordType.Winner:
                        recordValue = result.WinnerPoints.ToString("0.##");
                        recordNumericValue = result.WinnerPoints;
                        break;

                    case MatchResultRecordType.Loser:
                        recordValue = result.LoserPoints.ToString("0.##");
                        recordNumericValue = result.LoserPoints;
                        break;

                    case MatchResultRecordType.Combined:
                        recordValue = $"{(result.WinnerPoints + result.LoserPoints).ToString("0.##")} ({result.WinnerPoints.ToString("0.##")} - {result.LoserPoints.ToString("0.##")})";
                        recordNumericValue = result.WinnerPoints + result.LoserPoints;
                        break;

                    case MatchResultRecordType.Difference:
                    default:
                        recordValue = $"{(result.WinnerPoints - result.LoserPoints).ToString("0.##")} ({result.WinnerPoints.ToString("0.##")} - {result.LoserPoints.ToString("0.##")})";
                        recordNumericValue = result.WinnerPoints - result.LoserPoints;
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = recordValueType != MatchResultRecordType.Loser ? result.Winner : result.Loser,
                    OtherFranchise = recordValueType != MatchResultRecordType.Loser ? result.Loser : result.Winner,
                    RecordValue = recordValue,
                    RecordNumericValue = recordNumericValue,
                    Year = result.Year,
                    Week = result.Week
                });
            }
            return record;
        }

        private enum FranchiseRecordValueType
        {
            Championships,
            WinningSeasons,
            Wins,
            Loses,
            Points,
            Trades,
            OtherRecord
        }

        private enum TeamRecordValueType
        {
            Record,
            Wins,
            Loses,
            Points,
            Trades
        }

        private enum TeamScoreRecordValueType
        {
            Points,
            ProjectedPoints,
            ProjectedPointsDifference
        }

        private enum MatchResultRecordType
        {
            Difference,
            Combined,
            Winner,
            Loser
        }
    }
}
