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

        public async Task<IEnumerable<LeagueRecords>> GetLeagueRecords(Guid leagueId, int number, bool? recordPositivity = null)
        {
            using (var dbContext = dbFunc())
            {
                IList<LeagueRecords> recordCollection = new List<LeagueRecords>();

                if (!recordPositivity.HasValue || recordPositivity.Value)
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
                }

                if (!recordPositivity.HasValue || !recordPositivity.Value)
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

                return recordCollection;
            }
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
                switch (recordValueType)
                {
                    case TeamRecordValueType.Loses:
                        recordValue = team.Loses.ToString();
                        break;
                    case TeamRecordValueType.Wins:
                        recordValue = team.Wins.ToString();
                        break;
                    case TeamRecordValueType.Record:
                    default:
                        recordValue = $"{team.Wins}-{team.Loses}-{team.Ties}";
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = team.Franchise,
                    RecordValue = recordValue,
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
                switch (recordValueType)
                {
                    case TeamScoreRecordValueType.ProjectedPoints:
                        recordValue = score.ProjectedPoints.Value.ToString("0.##");
                        break;
                    case TeamScoreRecordValueType.ProjectedPointsDifference:
                        recordValue = $"{(score.Points - score.ProjectedPoints.Value).ToString("0.##")} ({score.Points.ToString("0.##") } vs {score.ProjectedPoints.Value.ToString("0.##")})";
                        break;
                    case TeamScoreRecordValueType.Points:
                    default:
                        recordValue = score.Points.ToString("0.##");
                        break;
                }

                record.Records.Add(new LeagueRecord()
                {
                    Rank = count++,
                    Franchise = score.Team.Franchise,
                    RecordValue = recordValue,
                    Year = score.Year,
                    Week = score.Week
                });
            }
            return record;
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
    }
}
