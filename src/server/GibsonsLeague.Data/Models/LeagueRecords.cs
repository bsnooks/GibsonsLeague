using System;
using System.Collections.Generic;
using System.Text;

namespace GibsonsLeague.Data.Models
{
    public class LeagueRecords
    {
        public string RecordTitle { get; set; }
        public bool PositiveRecord { get; set; }
        public RecordType RecordType { get; set; }
        public ICollection<LeagueRecord> Records { get; set; }
    }
}
