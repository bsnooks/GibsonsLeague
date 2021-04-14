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
                    .OrderByDescending(x => x.Year)
                    .ThenBy(x => x.Champion)
                    .ThenBy(x => x.SecondPlace)
                    .ThenBy(x => x.Standing)
                    .ToListAsync();
            }
        }
    }
}
