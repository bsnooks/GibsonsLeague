using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Core.Models;
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
                    .Include(x => x.Teams)
                    .ThenInclude(x => x.Franchise)
                    .SingleOrDefaultAsync(x => x.Year == year);
            }
        }

        public async Task<IEnumerable<Season>> GetSeasons(int? year = null, bool? finished = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Seasons
                    .Where(s => (!year.HasValue || s.Year == year.Value) &&
                    (!finished.HasValue || s.Finished == finished.Value)).ToListAsync();
            }
        }

        public async Task UpdateSeason(Season season)
        {
            using (var dbContext = dbFunc())
            {
                dbContext.Seasons.Update(season);
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
