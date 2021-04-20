using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class PlayerRepository
    {

        private readonly GLAContext dbContext;

        public PlayerRepository(GLAContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Player> GetOne(int id)
        {
            return await dbContext.Players
                .Include(p => p.PlayerSeasons)
                .SingleOrDefaultAsync(p => p.PlayerId == id);
        }

        public async Task<Player> GetOneByName(string name)
        {
            return await dbContext.Players
                .SingleOrDefaultAsync(p => p.Name.Contains(name));
        }

        public async Task<IEnumerable<Player>> LookupPlayer(string name, int offset, int limit)
        {
            return await dbContext.Players
                .Where(p => p.Name.Contains(name))
                .OrderBy(p => p.Name)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
        }
    }
}
