using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace PlayerTransactionsTool
{
    class Program
    {
        static void Main(string[] args)
        {
            Do();
        }

        private static void Do()
        {
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                IList<Player> players = db.Query<Player>("SELECT p.* FROM [dbo].[Player] p INNER JOIN [dbo].[PlayerSeason] ps ON p.PlayerID=ps.PlayerID AND ps.Year=2020 ORDER BY PlayerID DESC").ToList();
                IList<Franchise> f = db.Query<Franchise>("SELECT * FROM [dbo].[Franchise]").ToList();
                IDictionary<Guid, string> franchises = f.ToDictionary(x => x.FranchiseId, x => x.MainName);
                IList<UndocumentedTrade> undocumentedTrades = new List<UndocumentedTrade>();
                IDictionary<Guid, string> groupMapping = new Dictionary<Guid, string>();

                foreach (var player in players)
                {
                    //Console.WriteLine(player.Name);
                    var transactions = db.Query<Transaction, Team, Transaction>($"SELECT t.TransactionID, t.Year, t.Date, t.TransactionType, t.TeamID, t.Description, tm.TeamID, tm.FranchiseID FROM [dbo].[Transaction] t INNER JOIN [dbo].[Team] tm ON t.TeamID=tm.TeamID WHERE PlayerID={player.PlayerID} AND t.Year=2020 ORDER BY Year ASC, Date ASC",
                        (t, team) =>
                        {
                            t.Team = team;
                            return t;
                        },
                        splitOn: "TeamID"
                        ).ToList();
                    int currentYear = 0;
                    Guid? ownedBy = null;
                    Guid? ownedByTeamId = null;
                    Transaction lastTransaction = null;
                    foreach (var transaction in transactions)
                    {
                        if (transaction.TransactionType == TransactionType.VetoedTrade)
                        {
                            continue;
                        }

                        if (transaction.Year != currentYear)
                        {
                            if (ownedBy != null)
                            {
                                Console.WriteLine($"Ended With {franchises[ownedBy.Value]}");
                                var command = $"UPDATE [dbo].[PlayerSeason] SET EndTeamId = '{ownedByTeamId}' WHERE Year={currentYear} AND PlayerId={player.PlayerID}";

                                //db.Execute(command);
                            }
                            currentYear = transaction.Year;
                            //Console.WriteLine(currentYear);
                        }

                        switch (transaction.TransactionType)
                        {
                            case TransactionType.Added:
                            case TransactionType.Kept:
                            case TransactionType.DraftPicked:
                                if (ownedBy != null && ownedBy != transaction.Team.FranchiseId)
                                {
                                    if (transaction.TransactionType == TransactionType.DraftPicked)
                                    {
                                        //Console.WriteLine($"Released to Draft by {franchises[ownedBy.Value]}");
                                    }
                                    else if (transaction.TransactionType == TransactionType.Kept)
                                    {
                                        //Console.WriteLine($"{currentYear}{player.Name}:Aquired via undocumented trade between {franchises[transaction.Team.FranchiseId]} and {franchises[ownedBy.Value]}");
                                        undocumentedTrades.Add(new UndocumentedTrade()
                                        {
                                            TransactionID=transaction.TransactionID,
                                            Year = currentYear,
                                            ToFranchise = transaction.Team.FranchiseId,
                                            ToTeamId = transaction.TeamID,
                                            FromFranchise = ownedBy.Value,
                                            FromTeamId = ownedByTeamId.Value,
                                            PlayerId = player.PlayerID,
                                            PlayerName = player.Name,
                                            Date = transaction.Date.AddMinutes(-1),
                                        });
                                    }
                                }
                                ownedBy = transaction.Team.FranchiseId;
                                ownedByTeamId = transaction.TeamID;
                                break;

                            case TransactionType.Traded:
                                ownedBy = transaction.Team.FranchiseId;
                                ownedByTeamId = transaction.TeamID;
                                break;

                            case TransactionType.Dropped:
                                ownedBy = null;
                                ownedByTeamId = null;
                                break;

                        }

                        //Console.WriteLine(transaction.Description);
                        lastTransaction = transaction;
                    }
                    if (ownedBy != null)
                    {
                        Console.WriteLine($"{player.Name} Ended With {franchises[ownedBy.Value]}");
                        var command = $"UPDATE [dbo].[PlayerSeason] SET EndTeamId = '{ownedByTeamId}' WHERE Year=2020 AND PlayerId={player.PlayerID}";

                        db.Execute(command);
                    }
                }

                foreach (var trade in undocumentedTrades.OrderBy(x => x.Year).ThenBy(x => x.ToFranchise))
                {
                    var relatedList = undocumentedTrades.Where(t => t.PlayerId != trade.PlayerId &&
                        t.Year == trade.Year &&
                        ((t.FromFranchise == trade.ToFranchise || t.ToFranchise == trade.ToFranchise) &&
                        (t.FromFranchise == trade.FromFranchise || t.ToFranchise == trade.FromFranchise)));

                    if (!relatedList.Any())
                    {
                        Console.WriteLine($"Nothing related for {trade.Year}-{franchises[trade.ToFranchise]} and {franchises[trade.FromFranchise]}-{trade.PlayerName}");
                    }
                    else
                    {
                        //Console.WriteLine($"{trade.Year}-v1-{franchises[trade.ToFranchise]} and {franchises[trade.FromFranchise]}-{trade.PlayerName} maybe {string.Join(", ", relatedList.Select(x => x.PlayerName).ToArray())}");

                        var relatedFor = relatedList.Where(x => !(x.FromFranchise == trade.FromFranchise && x.ToFranchise == trade.ToFranchise)).Select(x => x.PlayerName).ToArray();
                        var relatedWith = relatedList.Where(x => x.FromFranchise == trade.FromFranchise && x.ToFranchise == trade.ToFranchise).Select(x => x.PlayerName).ToArray();

                        string description = relatedWith.Any() ?
                            $"{trade.Year} - {franchises[trade.FromFranchise]} traded {trade.PlayerName} with {string.Join(", ", relatedWith)} to {franchises[trade.ToFranchise]} for {string.Join(", ", relatedFor)}" :
                            $"{trade.Year} - {franchises[trade.FromFranchise]} traded {trade.PlayerName} to {franchises[trade.ToFranchise]} for {string.Join(", ", relatedFor)}";

                        //Console.WriteLine(description);
                        trade.Description = description;

                        if (!groupMapping.ContainsKey(trade.TransactionID))
                        {
                            var transactionGroup = Guid.NewGuid().ToString();
                            string command = $"INSERT INTO [dbo].[TransactionGroup] (TransactionGroupID) VALUES ('{transactionGroup}')";
                            //db.Execute(command);

                            groupMapping.Add(trade.TransactionID, transactionGroup);

                            foreach (var related in relatedList)
                            {
                                groupMapping.Add(related.TransactionID, transactionGroup);
                            }
                        }


                        //


                    }
                }

                foreach (var trade in undocumentedTrades.OrderBy(x => x.Year).ThenBy(x => x.FromFranchise))
                {
                    if (groupMapping.ContainsKey(trade.TransactionID))
                    {
                        var command = $"INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Date, Description) VALUES ('{groupMapping[trade.TransactionID]}', '{trade.ToTeamId}', {5}, '{trade.PlayerId}', '{trade.Date}', '{trade.Description.Replace("'", "''")}')";

                        //db.Execute(command);
                        //Console.WriteLine(command);
                    }
                }
            }
        }

        public class UndocumentedTrade
        {
            public Guid TransactionID { get; set; }
            public DateTime Date { get; set; }
            public int Year { get; set; }
            public Guid ToFranchise { get; set; }
            public Guid FromFranchise { get; set; }
            public Guid ToTeamId { get; set; }
            public Guid FromTeamId { get; set; }
            public int PlayerId { get; set; }
            public string PlayerName { get; set; }
            public string Description { get; set; }
        }
    }
}
