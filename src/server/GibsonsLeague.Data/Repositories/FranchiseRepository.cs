using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class FranchiseRepository
    {

        private readonly GLAContext dbContext;

        public FranchiseRepository(GLAContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<IEnumerable<Franchise>> GetAll()
        {
            return await dbContext.Franchises
                .Include(x => x.Teams)
                .ThenInclude(x => x.Transactions)
                .ToListAsync();
        }


        public async Task<Franchise> GetOne(Guid id)
        {
            return await dbContext.Franchises
                .Include(x => x.Teams)
                .ThenInclude(x => x.Transactions)
                .Include(x => x.Teams)
                .ThenInclude(x => x.PlayerSeasons)
                .ThenInclude(x => x.Player)
                .SingleOrDefaultAsync(x => x.FranchiseId== id);
        }

        public async Task<Franchise> GetOneByName(string name)
        {
            return await dbContext.Franchises
                .Include(x => x.Teams)
                .ThenInclude(x => x.Transactions)
                .Include(x => x.Teams)
                .ThenInclude(x => x.PlayerSeasons)
                .ThenInclude(x => x.Player)
                .SingleOrDefaultAsync(x => x.MainName == name);
        }

        public async Task<IEnumerable<Legend>> GetTeamLegends(Franchise franchise, bool started = true, int limit = 15)
        {
            try
            {
                var allWeeks = await dbContext.PlayerWeeks
                    .Where(pw => pw.Started == started && pw.Team.FranchiseId == franchise.FranchiseId)
                    .Include(x => x.Player)
                    .ToListAsync();

                return allWeeks
                    .GroupBy(pw => pw.PlayerId)
                    .OrderByDescending(g => g.Sum(x => x.PassYards / 25.0 + x.PassTDs * 4 + x.RushYards / 10.0 + x.RushTDs * 6 + x.RecYards / 10.0 + x.RecTDs * 6))
                    .Take(limit)
                    .Select(g => new Legend()
                    {
                        Years = g.Select(x => x.Year).Distinct().ToList(),
                        GamesPlayed = g.Count(),
                        Player = g.FirstOrDefault().Player,
                        Points = g.Sum(x => x.Points)
                    });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            return Enumerable.Empty<Legend>();
        }
    }
}