using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class TeamRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public TeamRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<Team>> GetTeams(Guid? franchiseId = null, int? year = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Teams
                    .Where(x => (!franchiseId.HasValue || x.FranchiseId == franchiseId || x.FranchiseId == franchiseId)
                        && (!year.HasValue || x.Year == year))
                    .Include(x => x.Transactions)
                    .Include(x => x.Franchise)
                    .OrderByDescending(x => x.Year)
                    .ThenBy(x => x.Standing)
                    .ThenBy(x => x.Champion)
                    .ThenBy(x => x.SecondPlace)
                    .ToListAsync();
            }
        }

        public async Task<Team> GetTeam(Guid? franchiseId = null, Guid? teamId = null, int? year = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Teams
                    .Where(x => (!franchiseId.HasValue || x.FranchiseId == franchiseId)
                        && (!teamId.HasValue || x.TeamId == teamId)
                        && (!year.HasValue || x.Year == year))
                    .Include(x=> x.Transactions)
                    .Include(x => x.Franchise)
                    .SingleOrDefaultAsync();
            }
        }
    }
}
