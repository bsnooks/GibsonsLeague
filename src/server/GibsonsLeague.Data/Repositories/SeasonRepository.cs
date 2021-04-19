using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class SeasonRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public SeasonRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<Season> GetSeason(int year)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Seasons
                    .SingleOrDefaultAsync(x => x.Year == year);
            }
        }
    }
}
