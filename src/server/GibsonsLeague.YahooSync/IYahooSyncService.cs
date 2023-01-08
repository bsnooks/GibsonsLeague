﻿using GibsonsLeague.Core;
using GibsonsLeague.Core.Models;
using System.Threading;
using System.Threading.Tasks;

namespace GibsonsLeague.YahooSync
{
    public interface IYahooSyncService
    {
        Task SyncCurrentWeek(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncKeepers(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncDraft(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncTransactions(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncMatchups(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncStandings(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncPlayerStats(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncPlayerRoster(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncWeeklyRoster(ISyncContext context, Season season, CancellationToken cancellationToken = default);
        Task SyncWeeklyPlayerStats(ISyncContext context, Season season, CancellationToken cancellationToken = default);
    }
}
