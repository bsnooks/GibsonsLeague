using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class TransactionRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public TransactionRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<Transaction>> GetTransactions(Guid? franchiseId = null, int? playerId = null, TransactionType? type = null, int? year = null)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Transactions
                    .Where(x => (!franchiseId.HasValue || x.Team.FranchiseId == franchiseId)
                        && (!playerId.HasValue || x.PlayerId == playerId)
                        && (!type.HasValue || x.TransactionType == type)
                        && (!year.HasValue || x.Team.Year == year))
                    .Include(x => x.Team.Franchise)
                    .Include(x => x.Player)
                    .OrderByDescending(x => x.Date)
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<Transaction>> GetRelatedTransactions(Guid id, Guid? groupId)
        {
            if (groupId == null)
            {
                return Enumerable.Empty<Transaction>();
            }

            using (var dbContext = dbFunc())
            {
                return await dbContext.Transactions
                    .Where(x => x.TransactionId != id && x.TransactionGroupId == groupId)
                    .Include(x => x.Team.Franchise)
                    .Include(x => x.Player)
                    .OrderByDescending(x => x.Date)
                    .ThenBy(x => x.TeamId)
                    .ToListAsync();
            }
        }
    }
}
