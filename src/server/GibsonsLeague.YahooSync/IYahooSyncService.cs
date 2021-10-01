using GibsonsLeague.Core;
using GibsonsLeague.Core.Models;
using System.Threading;
using System.Threading.Tasks;

namespace GibsonsLeague.YahooSync
{
    public interface IYahooSyncService
    {
        Task SyncDraft(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncTransactions(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncMatchups(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncStandings(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncPlayerStats(ISyncContext context, Season season, CancellationToken cancellationToken = default);
    }
}
