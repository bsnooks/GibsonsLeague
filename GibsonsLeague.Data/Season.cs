using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class Season
    {
        public Season()
        {
            Drafts = new HashSet<Draft>();
            Matches = new HashSet<Match>();
            TeamScores = new HashSet<TeamScore>();
            Teams = new HashSet<Team>();
        }

        public Guid LeagueId { get; set; }
        public int Year { get; set; }
        public bool? Finished { get; set; }
        public int? YahooGameId { get; set; }

        public virtual League League { get; set; }
        public virtual ICollection<Draft> Drafts { get; set; }
        public virtual ICollection<Match> Matches { get; set; }
        public virtual ICollection<TeamScore> TeamScores { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
    }
}
