using System;
using System.Collections.Generic;
using System.Text;

namespace GibsonsLeague.Data.Models
{
    public class LeagueRecord
    {
        public int Rank { get; set; }
        public Franchise Franchise { get; set; }
        public string RecordValue { get; set; }
        public int? Year { get; set; }
        public int? Week { get; set; }
    }
}
