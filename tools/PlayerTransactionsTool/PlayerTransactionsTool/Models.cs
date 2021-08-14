using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PlayerTransactionsTool
{
    public partial class Franchise
    {
        public Guid FranchiseId { get; set; }
        public Guid LeagueId { get; set; }
        public string MainName { get; set; }
    }
    public partial class Team
    {

        public Guid TeamId { get; set; }
        public Guid LeagueId { get; set; }
        public Guid FranchiseId { get; set; }
        public Guid? OwnerId { get; set; }
        public int Year { get; set; }
        public string Name { get; set; }
        public int? YahooTeamId { get; set; }
        public int Wins { get; set; }
        public int Loses { get; set; }
        public int Ties { get; set; }
        public int Standing { get; set; }
        public double Points { get; set; }
        public bool Champion { get; set; }
        public bool SecondPlace { get; set; }
    }
    public class Player
    {
        public int PlayerID { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int YahooPlayerID { get; set; }
    }
    public partial class PlayerSeason
    {
        public int PlayerID { get; set; }
        public int Year { get; set; }
        public double Points { get; set; }
        public int PositionRank { get; set; }
        public int PositionRankPpg { get; set; }
        public int GamesPlayed { get; set; }
    }
    public partial class Transaction
    {
        public Guid TransactionID { get; set; }
        public Guid? TransactionGroupID { get; set; }
        public Guid TeamID { get; set; }
        public TransactionType TransactionType { get; set; }
        public int PlayerID { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public Guid? DraftPickID { get; set; }
        public int Year { get; set; }
        public virtual Team Team { get; set; }
    }
    public enum TransactionType
    {
        DraftPicked = 1,
        Kept = 2,
        Added = 3,
        Dropped = 4,
        Traded = 5,
        VetoedTrade = 6
    }
}
