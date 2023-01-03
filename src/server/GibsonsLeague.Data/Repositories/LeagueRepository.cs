using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using GibsonsLeague.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class LeagueRepository
    {

        private readonly GLAContext dbContext;

        public LeagueRepository(GLAContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<League>> GetAll()
        {
            return await dbContext.Leagues
                .Include(l => l.Franchises)
                .ToListAsync();
        }

        public async Task<League> GetOne(Guid id)
        {
            return await dbContext.Leagues
                .Include(l => l.Franchises)
                .ThenInclude(f => f.Teams)
                .SingleOrDefaultAsync(p => p.LeagueId == id);
        }

        public async Task<League> GetOneByName(string name)
        {
            return await dbContext.Leagues
                .Include(l => l.Franchises)
                .ThenInclude(f => f.Teams)
                .SingleOrDefaultAsync(p => p.Name == name);
        }
    }
}
