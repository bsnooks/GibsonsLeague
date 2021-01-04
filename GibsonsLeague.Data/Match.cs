using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class Match
    {
        public Guid MatchId { get; set; }
        public Guid LeagueId { get; set; }
        public int Year { get; set; }
        public int Week { get; set; }
        public Guid WinningTeamId { get; set; }
        public Guid LosingTeamId { get; set; }
        public int MatchTypeId { get; set; }
        public bool Tied { get; set; }

        public virtual League League { get; set; }
        public virtual Team LosingTeam { get; set; }
        public virtual Season Season { get; set; }
        public virtual Team WinningTeam { get; set; }
    }
}
