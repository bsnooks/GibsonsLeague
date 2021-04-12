using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class DraftRepository
    {

        private readonly GLAContext dbContext;

        public DraftRepository(GLAContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Draft>> GetAll()
        {
            return await dbContext.Drafts
                .OrderBy(x => x.Year)
                .ToListAsync();
        }

        public async Task<Draft> GetOne(Guid id)
        {
            return await dbContext.Drafts
                .SingleOrDefaultAsync(x => x.DraftId == id);
        }

        public async Task<Draft> GetOneByYear(Guid leagueId, int year)
        {
            return await dbContext.Drafts
                .SingleOrDefaultAsync(x => x.LeagueId == leagueId && x.Year == year);
        }
    }
}
