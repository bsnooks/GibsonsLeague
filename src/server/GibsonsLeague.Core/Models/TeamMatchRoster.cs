using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class TeamMatchRoster
    {
        public Guid TeamID { get; set; }
        public int Week { get; set; }
        public int PlayerId { get; set; }
        public string Position { get; set; }
    }
}
