using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class TeamScore
    {
        public Guid LeagueId { get; set; }
        public Guid TeamId { get; set; }
        public int Year { get; set; }
        public int Week { get; set; }
        public double Points { get; set; }
        public double? ProjectedPoints { get; set; }

        public virtual League League { get; set; }
        public virtual Season Season { get; set; }
        public virtual Team Team { get; set; }
    }
}
