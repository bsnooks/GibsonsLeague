using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class MatchRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public MatchRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<Match>> GetMatches(int limit, int offset, Guid? franchiseId = null, MatchType? type = null, int? year = null, int? week = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Matches
                    .Where(x => (!franchiseId.HasValue || x.LosingTeam.FranchiseId == franchiseId || x.WinningTeam.FranchiseId == franchiseId)
                        && (!type.HasValue || x.MatchTypeId == type)
                        && (!year.HasValue || x.Year == year)
                        && (!week.HasValue || x.Week == week))
                    .Include(x => x.LosingTeam.Franchise)
                    .Include(x => x.WinningTeam.Franchise)
                    .Include(x => x.WinningTeam.TeamScores.Where(s => !week.HasValue || s.Week == week))
                    .Include(x => x.LosingTeam.TeamScores.Where(s => !week.HasValue || s.Week == week))
                    .OrderByDescending(x => x.Year)
                    .ThenBy(x => x.Week)
                    .Skip(offset)
                    .Take(limit)
                    .ToListAsync();
            }
        }
    }
}
