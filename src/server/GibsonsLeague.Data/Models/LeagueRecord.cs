using System;
using System.Collections.Generic;
using System.Text;

namespace GibsonsLeague.Data.Models
{
    public class LeagueRecord
    {
        public int Rank { get; set; }
        public Franchise Franchise { get; set; }
        public Franchise OtherFranchise { get; set; }
        public Player Player { get; set; }
        public string RecordValue { get; set; }
        public double RecordNumericValue { get; set; }
        public int? Year { get; set; }
        public int? Week { get; set; }
    }
}
