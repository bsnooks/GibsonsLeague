﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GibsonsLeague.Data.Repositories
{
    public class PlayerRepository
    {

        private readonly Func<GLAContext> dbFunc;

        public PlayerRepository(Func<GLAContext> dbFunc)
        {
            this.dbFunc = dbFunc;
        }

        public async Task<Player> GetOne(int id)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Players
                .Include(p => p.PlayerSeasons)
                .SingleOrDefaultAsync(p => p.PlayerId == id);
            }
        }

        public async Task<Player> GetOneByName(string name)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Players
                .SingleOrDefaultAsync(p => p.Name.Contains(name));
            }
        }

        public async Task<IEnumerable<PlayerSeason>> GetPlayerSeasonComparison(IList<int> years, string position = null, bool allSlices = false)
        {
            int starterThreshold = 0;
            switch (position)
            {
                case "WR":
                    starterThreshold = 30;
                    break;
                case "TE":
                    starterThreshold = 10;
                    break;
                case "RB":
                case "QB":
                    starterThreshold = 20;
                    break;
                default:
                    starterThreshold = 30;
                    break;
            }

            if (starterThreshold == 0)
            {
                return Enumerable.Empty<PlayerSeason>();
            }

            int[] positionSlices = allSlices ?
                Enumerable.Range(1, starterThreshold).ToArray() :
                new int[] { 1, (starterThreshold / 2), starterThreshold };

            using (var dbContext = dbFunc())
            {
                try
                {
                    return await dbContext.PlayerSeasons
                       .Where(s => years.Contains(s.Year) &&
                           (position == null || s.Player.Position == position) &&
                           positionSlices.Contains(s.PositionRank))
                       .Include(s => s.Player)
                       .OrderByDescending(s => s.Year)
                       .ThenBy(s => s.PositionRank)
                       .ThenBy(s => s.Player.Position)
                       .ToListAsync();
                }
                catch (Exception)
                {
                    return Enumerable.Empty<PlayerSeason>();
                }
            }
        }

        public async Task<IEnumerable<PlayerSeason>> GetPlayerSeasons(Franchise franchise)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.PlayerSeasons
                    .Where(ps => ps.EndTeam.FranchiseId == franchise.FranchiseId)
                    .Include(ps => ps.Player)
                    .ToListAsync();
            }
        }


        public async Task<IEnumerable<Player>> LookupPlayer(string name, string position, int offset, int limit)
        {
            using (var dbContext = dbFunc())
            {
                return await dbContext.Players
                .Where(p => p.Name.Contains(name) && (string.IsNullOrEmpty(position) || p.Position == position))
                .OrderBy(p => p.Name)
                .Skip(offset)
                .Take(limit)
                .ToListAsync();
            }
        }
    }
}
