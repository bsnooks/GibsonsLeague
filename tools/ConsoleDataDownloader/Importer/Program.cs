using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Xml.Linq;
using Dapper;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Importer
{
    class Program
    {

        static void Main(string[] args)
        {
            //UpdatePlayers();
            ImportTransactions();
        }

        private static void UpdatePlayers()
        {
            var token = "--TOKEN--";
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            IEnumerable<Player> players;
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                players = db.Query<Player>("SELECT * FROM [dbo].[Player] WHERE Name IS NULL ORDER BY PlayerID DESC");

                foreach (var player in players)
                {
                    var result = client.GetAsync($"https://fantasysports.yahooapis.com/fantasy/v2/player/175.p.{player.YahooPlayerID}").GetAwaiter().GetResult();


                    if (result.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        try
                        {
                            var rawResult = result.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                            var data = ConvertXmlStringToDynamic(rawResult);
                            var name = data.fantasy_content.player.name.full;
                            string position = string.Join(", ", data.fantasy_content.player.eligible_positions.position);
                            Console.WriteLine($"Updated {player.PlayerID} to {name} ({position})");
                            db.Execute("Update [dbo].[Player] SET Name=@name,Position=@position WHERE PlayerID=@playerId", new { name, playerId = player.PlayerID, position });
                        }
                        catch
                        {
                            Console.WriteLine($"Issue updating {player.PlayerID}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Issue downloading {player.PlayerID}");
                    }

                }
            }
        }

        private static void ImportTransactions()
        {
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                var franchises = db.Query<Franchise>("SELECT * FROM [dbo].[Franchise]");
                var leagueID = franchises.FirstOrDefault().LeagueID;

                IList<Player> players = db.Query<Player>("SELECT * FROM [dbo].[Player] WHERE Name IS NULL ORDER BY PlayerID DESC").ToList();

                IDictionary<string, int> errorCounts = new Dictionary<string, int>();
                for (int year = 2004; year < 2021; year++)
                {
                    Console.WriteLine($"Starting {year}");
                    var teams = db.Query<Team>("SELECT * FROM [dbo].[Team] WHERE Year=@year",
                                new { year = year });

                    var sampleFile = @$"D:\personal\repos\gibsonsleague\data\transactions\{year}.xml";
                    var sampleXml = File.ReadAllText(sampleFile);
                    var data = ConvertXmlStringToDynamic(sampleXml);

                    foreach (var transaction in data.fantasy_content.league.transactions.transaction)
                    {
                        if (transaction.type == "commish")
                        {
                            continue;
                        }

                        try
                        {
                            DateTimeOffset dateoffset = DateTimeOffset.FromUnixTimeSeconds(long.Parse(transaction.timestamp.ToString()));
                            string date = dateoffset.DateTime.ToString();

                            if (transaction.players.count == "1")
                            {
                                string command = null;
                                var player = transaction.players.player;

                                string teamKey = player.transaction_data.type == "drop" ? player.transaction_data.source_team_key : player.transaction_data.destination_team_key;
                                var team = teams.Where(t => t.YahooTeamID == GetIdFromKey(teamKey)).FirstOrDefault();

                                var playerId = int.Parse(player.player_id);
                                if (!players.Any(p => p.PlayerID == playerId))
                                {
                                    try
                                    {
                                        command = $"INSERT INTO [dbo].[Player] (PlayerID, Name, Position, YahooPlayerID) VALUES ({playerId}, '{ToSqlString(player.name.full)}', '{player.display_position}', {playerId})";
                                        db.Execute(command);
                                        players.Add(new Player() { PlayerID = playerId, YahooPlayerID = playerId, Name = player.name.full, Position = player.display_position });
                                    }catch
                                    {

                                    }
                                }

                                command = ImportTransactionPlayer(player, year, team, date);

                                if (command != null)
                                {
                                    db.Execute(command);
                                    //Console.WriteLine(command);
                                }
                            }
                            else
                            {
                                var transactionGroup = Guid.NewGuid().ToString();

                                string command = $"INSERT INTO [dbo].[TransactionGroup] (TransactionGroupID) VALUES ('{transactionGroup}')";
                                //Console.WriteLine(command);
                                db.Execute(command);

                                foreach (var player in transaction.players.player)
                                {
                                    string teamKey = player.transaction_data.type == "drop" ? player.transaction_data.source_team_key : player.transaction_data.destination_team_key;
                                    var team = teams.Where(t => t.YahooTeamID == GetIdFromKey(teamKey)).FirstOrDefault();

                                    var playerId = int.Parse(player.player_id);
                                    if (!players.Any(p => p.PlayerID == playerId))
                                    {
                                        try
                                        {
                                            command = $"INSERT INTO [dbo].[Player] (PlayerID, Name, Position, YahooPlayerID) VALUES ({playerId}, '{ToSqlString(player.name.full)}', '{player.display_position}', {playerId})";
                                            db.Execute(command);
                                            players.Add(new Player() { PlayerID = playerId, YahooPlayerID = playerId, Name = player.name.full, Position = player.display_position });
                                        }
                                        catch { }
                                    }

                                    command = ImportTransactionPlayer(player, year, team, date, transactionGroup);

                                    if (command != null)
                                    {
                                        db.Execute(command);
                                        //Console.WriteLine(command);
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            if (errorCounts.ContainsKey(transaction.type))
                            {
                                errorCounts[transaction.type]++;
                            }
                            else
                            {
                                errorCounts[transaction.type] = 1;
                            }
                            Console.WriteLine($"Issue with {transaction.type} Transaction ({transaction.transaction_key}) - \"{ex.Message}\"");
                        }
                    }

                }
                //Console.WriteLine($"{JsonConvert.SerializeObject(errorCounts)}");
            }
        }

        private static string ImportTransactionPlayer(dynamic player, int year, Team team, string date, string groupId = null)
        {
            var franchiseName = TeamNameToFranciseMapping[$"{year}.{team.Name}"];

            string type = "";
            string description = "";
            switch (player.transaction_data.type)
            {
                case "add":
                    type = "3";
                    description = $"Added by {ToSqlString(franchiseName)}";
                    break;
                case "drop":
                    type = "4";
                    description = $"Dropped by {ToSqlString(franchiseName)}";
                    break;
                case "trade":
                    type = "5";
                    description = $"Traded to {ToSqlString(franchiseName)}";
                    break;
            }

            string command;
            if (groupId == null)
            {
                command = $"INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, Date, Description) VALUES ('{team.TeamID}', {type}, '{player.player_id}', '{date}', '{description}')";
            }
            else
            {
                command = $"INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Date, Description) VALUES ('{groupId}', '{team.TeamID}', {type}, '{player.player_id}', '{date}', '{description}')";
            }

            return command;
        }

        private static void ImportDrafts()
        {
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                var franchises = db.Query<Franchise>("SELECT * FROM [dbo].[Franchise]");
                var leagueID = franchises.FirstOrDefault().LeagueID;

                IList<int> addedPlayers = new List<int>();

                for (int year = 2002; year < 2021; year++)
                {
                    var teams = db.Query<Team>("SELECT * FROM [dbo].[Team] WHERE Year=@year",
                                new { year = year });

                    var sampleFile = @$"D:\personal\repos\gibsonsleague\data\draftresults\{year}.xml";
                    var sampleXml = File.ReadAllText(sampleFile);
                    var data = ConvertXmlStringToDynamic(sampleXml);

                    var picks = Int32.Parse(data.fantasy_content.league.draft_results.count);
                    var rounds = picks / 10;

                    var draftId = Guid.NewGuid().ToString();

                    string command = $"INSERT INTO [dbo].[Draft] (DraftID, LeagueID, Year, Date, Rounds) OUTPUT INSERTED.DraftID VALUES ('{draftId}', '{leagueID}', {year}, '{data.fantasy_content.league.start_date}', {rounds})";
                    Console.WriteLine(command);
                    db.Execute(command);

                    foreach (var pick in data.fantasy_content.league.draft_results.draft_result)
                    {
                        var team = teams.Where(t => t.YahooTeamID == GetIdFromKey(pick.team_key)).FirstOrDefault();
                        int playerId = GetIdFromKey(pick.player_key);
                        if (!addedPlayers.Contains(playerId))
                        {
                            command = $"INSERT INTO [dbo].[Player] (PlayerID, YahooPlayerID) VALUES ({playerId}, {playerId})";
                            db.Execute(command);

                            addedPlayers.Add(playerId);
                        }

                        int pickNumber = int.Parse(pick.pick);

                        if (year == 2002 || pickNumber > 50)
                        {
                            Console.WriteLine($"{year} Round: {pick.round}-{pick.pick}");
                            var draftPickID = Guid.NewGuid().ToString();
                            command = $"INSERT INTO [dbo].[DraftPick] (DraftPickID, DraftID, TeamID, Round, Pick, PlayerID) OUTPUT INSERTED.DraftPickID VALUES ('{draftPickID}', '{draftId}', '{team.TeamID}', {pick.round}, {pick.pick}, {playerId})";
                            db.Execute(command);

                            command = $"INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, Date, DraftPickID, Description) VALUES ('{team.TeamID}', 1, {playerId}, '{data.fantasy_content.league.start_date}', '{draftPickID}', 'Drafted in round {pick.round} ({pick.pick} overall)')";
                            db.Execute(command);
                        }
                        else
                        {
                            var franchiseName = TeamNameToFranciseMapping[$"{year}.{team.Name}"];
                            Console.WriteLine($"{year} Keeper for {franchiseName}");

                            command = $"INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, Date, Description) VALUES ('{team.TeamID}', 2, {playerId}, '{data.fantasy_content.league.start_date}', 'Kept by {ToSqlString(franchiseName)}')";
                            db.Execute(command);
                        }
                    }
                }
            }
        }

        private static void ImportMatchesAndScores()
        { 
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                var franchises = db.Query<Franchise>("SELECT * FROM [dbo].[Franchise]");
                var leagueID = franchises.FirstOrDefault().LeagueID;

                for (int year = 2002; year < 2021; year++)
                {
                    var teams = db.Query<Team>("SELECT * FROM [dbo].[Team] WHERE Year=@year",
                                new { year = year });

                    for (int week = 1; week < 17; week++)
                    {
                        var sampleFile = @$"D:\personal\repos\gibsonsleague\data\scoreboards\{year}.{week}.xml";
                        var sampleXml = File.ReadAllText(sampleFile);
                        var data = ConvertXmlStringToDynamic(sampleXml);

                        if (!((IDictionary<String, object>)data.fantasy_content.league).ContainsKey("exceptions"))
                        {
                            foreach (var matchup in data.fantasy_content.league.scoreboard.matchups.matchup)
                            {
                                Team team1 = null;
                                Team team2 = null;
                                double score1 = 0;
                                double score2 = 0;
                                int teamCount = 0;
                                foreach (var yteam in matchup.teams.team)
                                {
                                    var team = teams.Where(t => t.YahooTeamID.ToString() == yteam.team_id).FirstOrDefault();
                                    var points = yteam.team_points.total;
                                    double? projectedPoints = null;
                                    double pp = 0;
                                    if (((IDictionary<String, object>)yteam).ContainsKey("team_projected_points") &&
                                        double.TryParse(yteam.team_projected_points.total, out pp))
                                    {
                                        projectedPoints = pp;
                                    }

                                    //string command = $"INSERT INTO [dbo].[TeamScore] (LeagueID, TeamID, Year, Week, Points, ProjectedPoints) VALUES ('{leagueID}', '{team.TeamID}', {year}, {week}, {points}, {projectedPoints?.ToString() ?? "NULL"});";
                                    //Console.WriteLine($"{command}");
                                    //db.Execute(command);

                                    double convertedPoints = double.Parse(points);
                                    if (teamCount == 0)
                                    {
                                        team1 = team;
                                        score1 = convertedPoints;
                                    }
                                    else
                                    {
                                        team2 = team;
                                        score2 = convertedPoints;
                                    }

                                    teamCount++;
                                }

                                // 1 = Regular, 2 = Playoff, 3 = Consolation, 4 = Finals
                                int matchType = 1;
                                if (matchup.is_playoffs == "1" && matchup.is_consolation =="0" && week == 16)
                                {
                                    matchType = 4;
                                }
                                else if (matchup.is_playoffs == "1" && matchup.is_consolation == "0" && week != 16)
                                {
                                    matchType = 2;
                                }
                                else if (matchup.is_consolation == "1")
                                {
                                    matchType = 3;
                                }

                                string command;
                                if (score1 > score2)
                                {
                                    // Team 1 wins
                                    command = $"INSERT INTO [dbo].[Match] (LeagueID, Year, Week, WinningTeamID, LosingTeamID, MatchTypeID, Tied) VALUES ('{leagueID}', {year}, {week}, '{team1.TeamID}', '{team2.TeamID}', {matchType}, 0);";
                                }
                                else if (score1 < score2)
                                {
                                    // Team 2 wins
                                    command = $"INSERT INTO [dbo].[Match] (LeagueID, Year, Week, WinningTeamID, LosingTeamID, MatchTypeID, Tied) VALUES ('{leagueID}', {year}, {week}, '{team2.TeamID}', '{team1.TeamID}', {matchType}, 0);";
                                }
                                else
                                {
                                    // Tie
                                    command = $"INSERT INTO [dbo].[Match] (LeagueID, Year, Week, WinningTeamID, LosingTeamID, MatchTypeID, Tied) VALUES ('{leagueID}', {year}, {week}, '{team1.TeamID}', '{team2.TeamID}', {matchType}, 1);";
                                }

                                //Console.WriteLine($"{command}");
                                //db.Execute(command);

                            }
                        }
                        else
                        {
                            Console.WriteLine($"Exception in: {year}.{week}");
                        }
                    }


                }
            }
        }

        private static void ImportTeams()
        { 
            using (var db = new SqlConnection("--CONNECTION STRING--"))
            {
                var franchises = db.Query<Franchise>("SELECT * FROM [dbo].[Franchise]");
                var leagueID = franchises.FirstOrDefault().LeagueID;

                for (int year = 2002; year < 2021; year++)
                {
                    var sampleFile = @$"D:\personal\repos\gibsonsleague\data\standings\{year}.xml";
                    var sampleXml = File.ReadAllText(sampleFile);
                    var data = ConvertXmlStringToDynamic(sampleXml);


                    foreach (var team in data.fantasy_content.league.standings.teams.team)
                    {
                        var franchiseName = TeamNameToFranciseMapping[$"{year}.{team.name}"];
                        var franchise = franchises.Where(f => f.MainName == franchiseName).FirstOrDefault();

                        string command = $"INSERT INTO [dbo].[Team] (LeagueID, FranchiseID, Year, Name, YahooTeamID) VALUES ('{leagueID}', '{franchise.FranchiseID}', {year}, '{ToSqlString(team.name)}', '{team.team_id}');";

                        db.Execute(command);
                    }


                }
            }
        }
        public static dynamic ConvertXmlStringToDynamic(string xmlData)
        {
            XDocument doc = XDocument.Parse(xmlData);
            string jsonText = JsonConvert.SerializeXNode(doc);
            jsonText = jsonText.Replace("\"@", "\"");
            jsonText = jsonText.Replace("\"#text\"", "\"text\"");
            var converter = new ExpandoObjectConverter();
            return JsonConvert.DeserializeObject<ExpandoObject>(jsonText, converter);
        }

        private static int GetIdFromKey(string key)
        {
            var parts = key.Split('.');

            return int.Parse(parts[parts.Length - 1]);
        }

        private static string ToSqlString(string str)
        {
            return str.Replace("'", "''");
        }

        private static IDictionary<string, string> TeamNameToFranciseMapping = new Dictionary<string, string>
        {{"2002.GAGNON", "Gagnon"},
{"2002.leaf16", "leaf16"},
{"2002.Gibsons Team", "She's the Fastest"},
{"2002.The Doorknobs", "Balero Boyz"},
{"2002.the next T.O.", "Laters"},
{"2002.Sarent", "FB in the Groin"},
{"2002.betterthanandrew", "Steel Curtain"},
{"2002.The Guardians", "Army of Dakness"},
{"2002.Football Fever!", "The Bad Guys"},
{"2002.thebottomoftheberrel", "The Mojos"},
{"2003.Laters", "Laters"},
{"2003.The Defendin Champ", "Gagnon"},
{"2003.Chases Team", "Army of Dakness"},
{"2003.Hogles Team", "The Bad Guys"},
{"2003.Gibsons Team", "She's the Fastest"},
{"2003.the B.O.T.B", "The Mojos"},
{"2003.leaf16", "leaf16"},
{"2003.Bens blind artists", "Steel Curtain"},
{"2003.The Doorknobs", "Balero Boyz"},
{"2003.silver92scooty", "FB in the Groin"},
{"2004.The Doorknobs", "Balero Boyz"},
{"2004.13    JINXED    13", "Gagnon"},
{"2004.baileylynch", "Steel Curtain"},
{"2004.leaf16", "leaf16"},
{"2004.Laters", "Laters"},
{"2004.ifyoucanwalkandtalk", "FB in the Groin"},
{"2004.Gibsons Team", "She's the Fastest"},
{"2004.Hogle's HOGstars", "The Bad Guys"},
{"2004.ashton", "The Mojos"},
{"2004.The Evil Chopsticks.", "Army of Dakness"},
{"2005.Laters", "Laters"},
{"2005.Gagnon", "Gagnon"},
{"2005.The Hogstars", "The Bad Guys"},
{"2005.leaf16", "leaf16"},
{"2005.All Madden 2005", "Steel Curtain"},
{"2005.The Doorknobs", "Balero Boyz"},
{"2005.The Mojos", "The Mojos"},
{"2005.balero_boyz", "FB in the Groin"},
{"2005.Gibsons Team", "She's the Fastest"},
{"2005.THE SKANKS", "Army of Dakness"},
{"2006.Gagnon", "Gagnon"},
{"2006.leaf16", "leaf16"},
{"2006.The Hogstars", "The Bad Guys"},
{"2006.Laters", "Laters"},
{"2006.THE SKANKS", "Army of Dakness"},
{"2006.Gibsons Team (Chris)", "She's the Fastest"},
{"2006.Gibson's Team", "FB in the Groin"},
{"2006.Rod_Smith", "Steel Curtain"},
{"2006.The Mojo's", "The Mojos"},
{"2006.The Doorknobs", "Balero Boyz"},
{"2007.The Mojos", "The Mojos"},
{"2007.The Hogstars", "The Bad Guys"},
{"2007.Jamario Moon", "FB in the Groin"},
{"2007.THE SKANKS", "Army of Dakness"},
{"2007.leaf16", "leaf16"},
{"2007.Laters", "Laters"},
{"2007.Kordell Stewart", "She's the Fastest"},
{"2007.Gagnon", "Gagnon"},
{"2007.Wes Welker ismy team", "Steel Curtain"},
{"2007.The Doorknobs", "Balero Boyz"},
{"2008.Romophobia", "Army of Dakness"},
{"2008.The Mojos", "The Mojos"},
{"2008.Gagnon", "Gagnon"},
{"2008.Laters", "Laters"},
{"2008.Lesnar's bodygaurd", "Steel Curtain"},
{"2008.The Isaac Bruces", "FB in the Groin"},
{"2008.The Doorknobs", "Balero Boyz"},
{"2008.leaf16", "leaf16"},
{"2008.Kordell Stewart", "She's the Fastest"},
{"2008.Sarent", "The Bad Guys"},
{"2009.Kordell Stewart", "FB in the Groin"},
{"2009.East Dillon Lions", "The Bad Guys"},
{"2009.Ben Rapelisberger", "Army of Dakness"},
{"2009.No Marc Bulgers", "She's the Fastest"},
{"2009.leaf16", "leaf16"},
{"2009.The Mojos", "The Mojos"},
{"2009.The Doorknobs", "Balero Boyz"},
{"2009.Gagnon", "Gagnon"},
{"2009.Detroit Lions", "Steel Curtain"},
{"2009.Laters", "Laters"},
{"2010.The Book of Tebow", "Steel Curtain"},
{"2010.'93 Jays", "FB in the Groin"},
{"2010.'07 Patriots", "She's the Fastest"},
{"2010.leaf16", "leaf16"},
{"2010.The Mojos", "The Mojos"},
{"2010.Long Gain Rice", "Army of Dakness"},
{"2010.Double Dwaynebowe!", "The Bad Guys"},
{"2010.Gagnon", "Gagnon"},
{"2010.The Doorknobs", "Balero Boyz"},
{"2010.Laters", "Laters"},
{"2011.leaf16", "leaf16"},
{"2011.Gibsons Team", "She's the Fastest"},
{"2011.Laters", "Laters"},
{"2011.Island of Misfit QBs", "FB in the Groin"},
{"2011.Balero Boyz", "Balero Boyz"},
{"2011.Dezney Land", "Army of Dakness"},
{"2011.Tebowner", "Steel Curtain"},
{"2011.The Mojos", "The Mojos"},
{"2011.Got Heeeem!", "The Bad Guys"},
{"2011.Gagnon", "Gagnon"},
{"2012.Laters", "Laters"},
{"2012.leaf16", "leaf16"},
{"2012.Gagnon", "Gagnon"},
{"2012.Gibsons Team", "She's the Fastest"},
{"2012.Dezney Land", "Army of Dakness"},
{"2012.93 red", "FB in the Groin"},
{"2012.Password is Taco", "The Bad Guys"},
{"2012.The Mojos", "The Mojos"},
{"2012.Joe Buck Yourself", "Steel Curtain"},
{"2012.Balero Boyz", "Balero Boyz"},
{"2013.Gagnon", "Gagnon"},
{"2013.Team Name", "Steel Curtain"},
{"2013.She's the Fastest", "She's the Fastest"},
{"2013.Laters", "Laters"},
{"2013.Dezney Land", "Army of Dakness"},
{"2013.leaf16", "leaf16"},
{"2013.Balero Boyz", "Balero Boyz"},
{"2013.Gibson's Team", "FB in the Groin"},
{"2013.Password is Taco", "The Bad Guys"},
{"2013.The Mojos", "The Mojos"},
{"2014.She's the Fastest", "She's the Fastest"},
{"2014.Laters", "Laters"},
{"2014.Balero Boyz", "Balero Boyz"},
{"2014.The Mojos", "The Mojos"},
{"2014.Beats by Ray", "FB in the Groin"},
{"2014.Dezney Land", "Army of Dakness"},
{"2014.leaf16", "leaf16"},
{"2014.Team Name", "Steel Curtain"},
{"2014.Password is Taco", "The Bad Guys"},
{"2014.Gagnon", "Gagnon"},
{"2015.She's the Fastest", "She's the Fastest"},
{"2015.leaf16", "leaf16"},
{"2015.Gagnon", "Gagnon"},
{"2015.Dezney Land", "Army of Dakness"},
{"2015.Beats by Ray", "FB in the Groin"},
{"2015.The Bad Guys", "The Bad Guys"},
{"2015.Laters", "Laters"},
{"2015.Team Name", "Steel Curtain"},
{"2015.The Mojos", "The Mojos"},
{"2015.Balero Boyz", "Balero Boyz"},
{"2016.George C Scott", "FB in the Groin"},
{"2016.She's the Fastest", "She's the Fastest"},
{"2016.The Bad Guys", "The Bad Guys"},
{"2016.Gagnon", "Gagnon"},
{"2016.Balero Boyz", "Balero Boyz"},
{"2016.Dezney Land", "Army of Dakness"},
{"2016.The Mojos", "The Mojos"},
{"2016.Laters", "Laters"},
{"2016.leaf16", "leaf16"},
{"2016.Team Name", "Steel Curtain"},
{"2017.She's the Fastest", "She's the Fastest"},
{"2017.George C Scott", "FB in the Groin"},
{"2017.Gagnon", "Gagnon"},
{"2017.Balero Boyz", "Balero Boyz"},
{"2017.Laters", "Laters"},
{"2017.The Mojos", "The Mojos"},
{"2017.leaf16", "leaf16"},
{"2017.The Bad Guys", "The Bad Guys"},
{"2017.Dezney Land", "Army of Dakness"},
{"2017.Team Name", "Steel Curtain"},
{"2018.The Bad Guys", "The Bad Guys"},
{"2018.She's the Fastest", "She's the Fastest"},
{"2018.Steel Curtain", "Steel Curtain"},
{"2018.Gagnon", "Gagnon"},
{"2018.Balero Boyz", "Balero Boyz"},
{"2018.Army of Dakness", "Army of Dakness"},
{"2018.FB in the Groin", "FB in the Groin"},
{"2018.Laters", "Laters"},
{"2018.leaf16", "leaf16"},
{"2018.The Mojos", "The Mojos"},
{"2019.The Bad Guys", "The Bad Guys"},
{"2019.leaf16", "leaf16"},
{"2019.Army of Dakness", "Army of Dakness"},
{"2019.FB in the Groin", "FB in the Groin"},
{"2019.Laters", "Laters"},
{"2019.The Mojos", "The Mojos"},
{"2019.She's the Fastest", "She's the Fastest"},
{"2019.Gagnon", "Gagnon"},
{"2019.Steel Curtain", "Steel Curtain"},
{"2019.Balero Boyz", "Balero Boyz"},
{"2020.The Mojos", "The Mojos"},
{"2020.She's the Fastest", "She's the Fastest"},
{"2020.FB in the Groin", "FB in the Groin"},
{"2020.Gagnon", "Gagnon"},
{"2020.Balero Boyz", "Balero Boyz"},
{"2020.leaf16", "leaf16"},
{"2020.Laters", "Laters"},
{"2020.The Bad Guys", "The Bad Guys"},
{"2020.Army of Dakness", "Army of Dakness"},
{"2020.The Mad Guys", "Steel Curtain"}
        };

    }


    public class Franchise
    {
        public Guid FranchiseID { get; set; }
        public Guid LeagueID { get; set; }
        public string MainName { get; set; }
    }


    public class Team
    {
        public Guid TeamID { get; set; }
        public Guid FranchiseID { get; set; }
        public Guid LeagueID { get; set; }
        public Guid? OwnerID { get; set; }
        public int Year { get; set; }
        public string Name { get; set; }
        public int YahooTeamID{ get; set; }
    }

    public class Player
    {
        public int PlayerID { get; set; }
        public string Name { get; set; }
        public string Position { get; set; }
        public int YahooPlayerID { get; set; }
    }

}
