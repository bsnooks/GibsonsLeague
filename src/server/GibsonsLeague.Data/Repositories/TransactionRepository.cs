using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Core.Models;
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

        public async Task<IEnumerable<Transaction>> GetTransactions(int limit, int offset, Guid? franchiseId = null, int? playerId = null, TransactionType? type = null, int? year = null)
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
                    .ThenInclude(x => x.PlayerSeasons)
                    .OrderByDescending(x => x.Date)
                    .Skip(offset)
                    .Take(limit)
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
                    .ThenInclude(x => x.PlayerSeasons)
                    .OrderByDescending(x => x.Date)
                    .ThenBy(x => x.TeamId)
                    .ToListAsync();
            }
        }

        public async Task<IEnumerable<Transaction>> GetSubsequentTransactions(Transaction transaction)
        {
            using (var dbContext = dbFunc())
            {
                IList<Transaction> related = new List<Transaction>();
                var potential = await dbContext.Transactions
                    .Where(x => x.TransactionId != transaction.TransactionId &&
                        x.PlayerTransactionIndex > transaction.PlayerTransactionIndex &&
                        x.PlayerId == transaction.PlayerId)
                    .Include(x => x.Team.Franchise)
                    .Include(x => x.Player)
                    .ThenInclude(x => x.PlayerSeasons)
                    .OrderBy(x => x.PlayerTransactionIndex)
                    .ThenBy(x => x.Date)
                    .ToListAsync();

                var i = transaction.PlayerTransactionIndex;
                foreach (var p in potential)
                {
                    if (p.PlayerTransactionIndex != (i+1))
                    {
                        break;
                    }

                    bool lastTransaction = false;
                    switch(p.TransactionType)
                    {
                        case TransactionType.Kept:
                            related.Add(p);
                            i = p.PlayerTransactionIndex;
                            break;
                        case TransactionType.Dropped:
                        case TransactionType.Traded:
                            related.Add(p);
                            lastTransaction = true;
                            break;
                        case TransactionType.Added:
                        case TransactionType.DraftPicked:
                            lastTransaction = true;
                            break;
                        case TransactionType.VetoedTrade:
                            i = p.PlayerTransactionIndex;
                            break;
                    }

                    if (lastTransaction)
                    {
                        break;
                    }

                    if (p.Team.FranchiseId != transaction.Team.FranchiseId)
                    {
                        break;
                    }
                }

                return related;
            }
        }

        public async Task<Guid> CreateTransaction(Transaction newTransaction)
        {
            using (var dbContext = dbFunc())
            {
                await dbContext.AddAsync(newTransaction);
                await dbContext.SaveChangesAsync();
            }

            return newTransaction.TransactionId;
        }

        public async Task<int> CreateTransactions(IEnumerable<Transaction> newTransactions)
        {
            using (var dbContext = dbFunc())
            {
                await dbContext.AddRangeAsync(newTransactions);
                await dbContext.SaveChangesAsync();
            }

            return newTransactions.Count();
        }

        public async Task<Guid> CreateTransactionGroup(TransactionGroup newTransactionGroup)
        {
            using (var dbContext = dbFunc())
            {
                await dbContext.AddAsync(newTransactionGroup);
                await dbContext.SaveChangesAsync();
            }

            return newTransactionGroup.TransactionGroupId;
        }

        public async Task<int> CreateTransactionGroups(IEnumerable<TransactionGroup> newTransactionGroups)
        {
            using (var dbContext = dbFunc())
            {
                await dbContext.AddRangeAsync(newTransactionGroups);
                await dbContext.SaveChangesAsync();
            }

            return newTransactionGroups.Count();
        }
    }
}
