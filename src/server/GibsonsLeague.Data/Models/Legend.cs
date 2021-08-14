using System.Collections.Generic;

namespace GibsonsLeague.Data.Models
{
    public class Legend
    {
        public Player Player { get; set; }
        public IList<int> Years { get; set; }
        public double Points { get; set; }
    }
}
