using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class FranchiseTradeRepository
    {
        private readonly Func<GLAContext> dbFunc;

        public FranchiseTradeRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<IEnumerable<FranchiseTrade>> GetFranchiseTrades(int limit, int offset, Guid franchiseId)
        {
            using (var dbContext = dbFunc())
            {
                var franchise = await dbContext.Franchises.SingleAsync(x => x.FranchiseId == franchiseId);
                var tradeGroups = await dbContext.TransactionGroups
                    .Where(x => x.Transactions.Any(t => t.TransactionType == TransactionType.Traded && t.Team.FranchiseId == franchiseId))
                    .Include(x => x.Transactions).ThenInclude(x => x.Team).ThenInclude(x => x.Franchise)
                    .Include(x => x.Transactions).ThenInclude(x => x.Player)
                    .OrderByDescending(x => x.Date)
                    .Skip(offset)
                    .Take(limit)
                    .ToListAsync();

                return tradeGroups.Select(x =>
                    new FranchiseTrade()
                    {
                        TradeId = x.TransactionGroupId,
                        Date = x.Date,
                        Franchise = franchise,
                        TradedWith = x.Transactions.Where(t => t.Team.FranchiseId != franchiseId).Select(t => t.Team.Franchise).FirstOrDefault(),
                        TradedAwayTransactions = x.Transactions.Where(t => t.Team.FranchiseId != franchiseId),
                        TradedForTransactions = x.Transactions.Where(t => t.Team.FranchiseId == franchiseId),
                    });
            }
        }
    }
}
