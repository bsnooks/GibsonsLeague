using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class FranchiseRepository
    {

        private readonly GLAContext dbContext;

        public FranchiseRepository(GLAContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Franchise>> GetAll()
        {
            return await dbContext.Franchises.ToListAsync();
        }


        public async Task<Franchise> GetOne(Guid id)
        {
            return await dbContext.Franchises
                .SingleOrDefaultAsync(x => x.FranchiseId== id);
        }

        public async Task<Franchise> GetOneByName(string name)
        {
            return await dbContext.Franchises
                .SingleOrDefaultAsync(x => x.MainName == name);
        }
    }
}
