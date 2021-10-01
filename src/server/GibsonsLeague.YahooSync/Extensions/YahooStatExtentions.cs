using GibsonsLeague.YahooSync.Models;
using System.Linq;

namespace GibsonsLeague.YahooSync
{
    /// <summary>
    /// Extention method for yahoo stats.
    /// </summary>
    public static class YahooStatExtentions
    {
        public static int GetStatValue(this YahooStats yahooStats, YahooStatType type)
        {
            var stat = yahooStats.Stat.FirstOrDefault(s => s.StatId == (int)type);
            if (stat != null)
            {
                return stat.Value;
            }

            return 0;
        }
        public static double CalculatePoints(this YahooStats yahooStats)
        {
            var passingYards = yahooStats.GetStatValue(YahooStatType.PassingYards);
            var passingTouchdowns = yahooStats.GetStatValue(YahooStatType.PassingTouchdowns);
            var rushingYards = yahooStats.GetStatValue(YahooStatType.RushingYards);
            var rushingTouchdowns = yahooStats.GetStatValue(YahooStatType.RushingTouchdowns);
            var receivingYards = yahooStats.GetStatValue(YahooStatType.ReceivingYards);
            var receivingTouchdowns = yahooStats.GetStatValue(YahooStatType.ReceivingTouchdowns);

            return (passingYards / 25) + (passingTouchdowns * 4) + (rushingYards / 10) + (rushingTouchdowns * 6) + (receivingYards / 10) + (receivingTouchdowns * 6);
        }
    }
}
