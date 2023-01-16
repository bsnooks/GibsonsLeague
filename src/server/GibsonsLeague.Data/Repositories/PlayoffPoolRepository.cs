using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using GibsonsLeague.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class PlayoffPoolRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public PlayoffPoolRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<PlayoffPool> GetPlayoffPool(CancellationToken cancellationToken = default)
        {
            var pool = new PlayoffPool();

            using (var dbContext = dbFunc())
            {

                var franchises = await dbContext.Franchises.ToListAsync();
                var players = await dbContext.PlayoffPoolPlayers .ToListAsync();

                foreach (var group in players.GroupBy(x => x.FranchiseId))
                {
                    var franchise = franchises.FirstOrDefault(x => x.FranchiseId == group.Key);
                    if (franchise == null) continue;

                    PlayoffPoolTeam team = new()
                    {
                        FranchiseId = franchise.FranchiseId,
                        Name = franchise.MainName
                    };
                    foreach (var player in group)
                    {
                        pool.Players.Add(player);
                        team.Points += player.Points;
                        team.GamesPlayed += player.GamesPlayed;
                        team.PlayersRemaining += player.Eliminated ? 0 : 1;
                    }
                    pool.Teams.Add(team);
                }
            }

            return pool;
        }
    }
}
