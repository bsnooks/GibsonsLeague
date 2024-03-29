﻿using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class Franchise
    {
        public Franchise()
        {
            Owners = new HashSet<Owner>();
            Teams = new HashSet<Team>();
        }

        public Guid FranchiseId { get; set; }
        public Guid LeagueId { get; set; }
        public string MainName { get; set; }
        public string Color { get; set; }

        public virtual League League { get; set; }
        public virtual ICollection<Owner> Owners { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
    }
}
