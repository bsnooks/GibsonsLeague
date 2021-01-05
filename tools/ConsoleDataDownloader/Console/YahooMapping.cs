using System;
using System.Collections.Generic;
using System.Text;

namespace App
{
    class YahooMapping
    {
        public IList<YahooSeason> seasons { get; set; }
    }
    public class YahooSeason
    {
        public int year { get; set; }
        public int yahooGameKey { get; set; }
        public int yahooLeagueKey { get; set; }
    }
}
