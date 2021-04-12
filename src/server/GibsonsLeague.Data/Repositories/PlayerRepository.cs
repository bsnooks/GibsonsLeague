using System;
using System.Collections.Generic;
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
                .SingleOrDefaultAsync(p => p.PlayerId == id);
        }

        public async Task<Player> GetOneByName(string name)
        {
            return await dbContext.Players
                .SingleOrDefaultAsync(p => p.Name.Contains(name));
        }
    }
}
