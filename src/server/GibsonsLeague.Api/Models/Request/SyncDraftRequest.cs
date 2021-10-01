using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GibsonsLeague.Api.Models.Request
{
    public class SyncDraftRequest
    {
        public int Year { get; set; }
        public Guid LeagueId { get; set; }
    }
}
