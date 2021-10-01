using System;

namespace GibsonsLeague.Api.Models.Request
{
    public class SyncTransactionsRequest
    {
        public int Year { get; set; }
        public Guid LeagueId { get; set; }
    }
}
