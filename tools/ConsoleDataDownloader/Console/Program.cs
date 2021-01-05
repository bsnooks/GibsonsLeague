using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using Newtonsoft.Json;

namespace App
{
    class Program
    {
        static void Main(string[] args)
        {
            var token = "--TOKEN--";
            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var jsonString = File.ReadAllText("yahooMappings.json");

            var mapping = JsonConvert.DeserializeObject<YahooMapping>(jsonString);

            foreach (var season in mapping.seasons)
            {
                for (int week = 1; week < 17; week++)
                {
                    var gameId = season.yahooGameKey;
                    var leagueId = season.yahooLeagueKey;
                    var result = client.GetAsync($"https://fantasysports.yahooapis.com/fantasy/v2/league/{gameId}.l.{leagueId}/scoreboard;week={week}").GetAwaiter().GetResult();


                    if (result.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        try
                        {
                            var rawResult = result.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                            File.WriteAllText($"{season.year}.{week}.xml", rawResult);
                            Console.WriteLine($"{season.year}, {week} Downloaded");
                        }
                        catch
                        {
                            Console.WriteLine($"Issue writing {season.year}, {week}");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Issue downloading {season.year}, {week}");
                    }
                }
            }
        }
    }
}
