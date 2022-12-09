using System.Linq;
using GibsonsLeague.Core.Models;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Player : ObjectGraphType<GibsonsLeague.Core.Models.Player>
    {
        public Player(PlayerRepository playerRepository, TransactionRepository transactionRepository)
        {
            Field(l => l.PlayerId);
            Field(l => l.Name);
            Field(l => l.Position);
            Field(l => l.PrimaryPosition);
            Field(x => x.YahooPlayerId, nullable: true, type: typeof(IntGraphType));

            Field<IntGraphType>("SeasonsCount", resolve: context => context.Source.PlayerSeasons.Count());
            Field<IntGraphType>("GamesPlayed", resolve: context => context.Source.PlayerSeasons.Sum(x => x.GamesPlayed));
            Field<IntGraphType>("GamesStarted", resolve: context => context.Source.PlayerWeeks.Count(x => x.Started));
            Field<IntGraphType>("GamesBenched", resolve: context => context.Source.PlayerWeeks.Count(x => !x.Started));
            Field<FloatGraphType>("AvgPositionRank", resolve: context => {
                if (!context.Source.PlayerSeasons.Any(x => x.GamesPlayed > 0))
                {
                    return null;
                }
                return context.Source.PlayerSeasons.Where(x=> x.GamesPlayed > 0).Average(x => x.PositionRank);
            });
            Field<FloatGraphType>("AvgPositionRankPpg", resolve: context => {
                if (!context.Source.PlayerSeasons.Any(x => x.PositionRankPpg > 0))
                {
                    return null;
                }
                return context.Source.PlayerSeasons.Where(x => x.PositionRankPpg > 0).Average(x => x.PositionRankPpg);
            });
            Field<FloatGraphType>("Points", resolve: context => {
                if (!context.Source.PlayerSeasons.Any())
                {
                    return null;
                }
                return context.Source.PlayerSeasons.Sum(x => x.Points);
            });
            Field<FloatGraphType>("PointsPerSeason", resolve: context => {
                if (!context.Source.PlayerSeasons.Any(x => x.GamesPlayed > 0))
                {
                    return null;
                }
                return context.Source.PlayerSeasons.Where(x => x.GamesPlayed > 0).Sum(x => x.Points) / context.Source.PlayerSeasons.Where(x => x.GamesPlayed > 0).Count();
            });
            Field<FloatGraphType>("PointsPerGame", resolve: context => {
                if (!context.Source.PlayerSeasons.Any(x => x.GamesPlayed > 0))
                {
                    return null;
                }
                return context.Source.PlayerSeasons.Where(x => x.GamesPlayed > 0).Sum(x => x.Points) / context.Source.PlayerSeasons.Where(x => x.GamesPlayed > 0).Sum(x => x.GamesPlayed);
            });

            Field< ListGraphType<PlayerSeason>>("seasons",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" }
                ),
                resolve: context =>
                {
                    var year = context.GetArgument<int?>("year");
                    return context.Source.PlayerSeasons.Where(p => (!year.HasValue || p.Year == year)).OrderByDescending(p => p.Year);
                });

            Field<ListGraphType<PlayerTransaction>>("transactions",
                arguments: new QueryArguments(
                    new QueryArgument<TransactionTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" }),
                resolve: context =>
                {
                    return transactionRepository.GetTransactions(
                        offset: context.GetArgument<int>("offset", 0),
                        limit: context.GetArgument<int>("limit", 20),
                        playerId: context.Source.PlayerId,
                        type: context.GetArgument<TransactionType?>("type"));
                });

            Field<ListGraphType<PlayerSeason>>("comparisonSeasons",
                resolve: context =>
                {
                    return playerRepository.GetPlayerSeasonComparison(
                        position: context.Source.Position,
                        years: context.Source.PlayerSeasons.Select(s => s.Year).ToList());
                });

            
        }
    }
}
