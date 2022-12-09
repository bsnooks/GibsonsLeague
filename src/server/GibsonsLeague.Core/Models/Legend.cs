using System.Collections.Generic;

namespace GibsonsLeague.Core.Models
{
    public class Legend
    {
        public Player Player { get; set; }
        public IList<int> Years { get; set; }
        public int GamesPlayed { get; set; }
        public double Points { get; set; }
    }
}
