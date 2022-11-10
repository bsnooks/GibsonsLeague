using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class Player
    {
        public Player()
        {
            DraftPicks = new HashSet<DraftPick>();
            PlayerSeasons = new HashSet<PlayerSeason>();
            PlayerWeeks = new HashSet<PlayerWeek>();
            Transactions = new HashSet<Transaction>();
        }

        public int PlayerId { get; set; }
        public int BirthYear { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int? YahooPlayerId { get; set; }
        public string PrimaryPosition { get; set; }
        public string ShortName { get; set; }

        public virtual ICollection<DraftPick> DraftPicks { get; set; }
        public virtual ICollection<PlayerSeason> PlayerSeasons { get; set; }
        public virtual ICollection<PlayerWeek> PlayerWeeks { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
