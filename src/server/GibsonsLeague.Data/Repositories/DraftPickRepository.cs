using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class DraftPickRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public DraftPickRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<DraftPick>> GetDraft(Guid id, int? round = null, int? pick = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.DraftPicks
                    .Where(x => x.DraftId == id && (!round.HasValue || x.Round == round) && (!pick.HasValue || x.Pick == pick))
                    .Include(x => x.Player)
                    .OrderBy(x => x.Draft.Year)
                    .ThenBy(x => x.Pick)
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<DraftPick>> GetPicks(Guid? franchiseId = null, int? year = null, int? round = null, int? pick = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.DraftPicks
                .Where(x => (!franchiseId.HasValue || x.Team.FranchiseId == franchiseId)
                    && (!year.HasValue || x.Draft.Year == year)
                    && (!round.HasValue || x.Round == round)
                    && (!pick.HasValue || x.Pick == pick))
                .Include(x => x.Draft)
                .Include(x => x.Player)
                .OrderBy(x => x.Draft.Year)
                .ThenBy(x => x.Pick)
                .ToListAsync();
            }
        }
    }
}
