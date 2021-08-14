using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class Team
    {
        public Team()
        {
            DraftPicks = new HashSet<DraftPick>();
            MatchLosingTeams = new HashSet<Match>();
            MatchWinningTeams = new HashSet<Match>();
            TeamScores = new HashSet<TeamScore>();
            Transactions = new HashSet<Transaction>();
            PlayerSeasons = new HashSet<PlayerSeason>();
        }

        public Guid TeamId { get; set; }
        public Guid LeagueId { get; set; }
        public Guid FranchiseId { get; set; }
        public Guid? OwnerId { get; set; }
        public int Year { get; set; }
        public string Name { get; set; }
        public int? YahooTeamId { get; set; }
        public int Wins { get; set; }
        public int Loses { get; set; }
        public int Ties { get; set; }
        public int Standing { get; set; }
        public double Points { get; set; }
        public bool Champion { get; set; }
        public bool SecondPlace { get; set; }

        public virtual Franchise Franchise { get; set; }
        public virtual League League { get; set; }
        public virtual Owner Owner { get; set; }
        public virtual Season Season { get; set; }
        public virtual ICollection<DraftPick> DraftPicks { get; set; }
        public virtual ICollection<Match> MatchLosingTeams { get; set; }
        public virtual ICollection<Match> MatchWinningTeams { get; set; }
        public virtual ICollection<TeamScore> TeamScores { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
        public virtual ICollection<PlayerSeason> PlayerSeasons { get; set; }
    }
}
