﻿using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class Player
    {
        public Player()
        {
            DraftPicks = new HashSet<DraftPick>();
            PlayerSeasons = new HashSet<PlayerSeason>();
            Transactions = new HashSet<Transaction>();
        }

        public int PlayerId { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int? YahooPlayerId { get; set; }
        public string PrimaryPosition { get; set; }
        public string ShortName { get; set; }

        public virtual ICollection<DraftPick> DraftPicks { get; set; }
        public virtual ICollection<PlayerSeason> PlayerSeasons { get; set; }
        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
