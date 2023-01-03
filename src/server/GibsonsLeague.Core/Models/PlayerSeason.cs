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
        public int PassYards { get; set; }
        public int PassTDs { get; set; }
        public int RushYards { get; set; }
        public int RushTDs { get; set; }
        public int RecYards { get; set; }
        public int RecTDs { get; set; }
        public int Interceptions { get; set; }
        public int FumblesLost { get; set; }
        public int TwoPointConvert { get; set; }
        public string NflTeam { get; set; }

        public override string ToString()
        {
            return $"{PlayerId}.{Year}";
        }
    }
}
