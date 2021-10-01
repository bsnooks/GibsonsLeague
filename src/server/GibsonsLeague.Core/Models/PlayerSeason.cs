using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class PlayerSeason
    {
        public int PlayerId { get; set; }
        public int Year { get; set; }
        public double Points { get; set; }
        public int PositionRank { get; set; }
        public int PositionRankPpg { get; set; }
        public int GamesPlayed { get; set; }
        public Guid? EndTeamId { get; set; }

        public virtual Player Player { get; set; }
        public virtual Team EndTeam { get; set; }
    }
}
