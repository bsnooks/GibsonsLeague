﻿using System.Linq;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Player : ObjectGraphType<GibsonsLeague.Data.Player>
    {
        public Player(TransactionRepository transactionRepository)
        {
            Field(l => l.PlayerId);
            Field(l => l.Name);
            Field(l => l.Position);
            Field(l => l.PrimaryPosition);
            Field(x => x.YahooPlayerId, nullable: true, type: typeof(IntGraphType));

            Field<IntGraphType>("SeasonsCount", resolve: context => context.Source.PlayerSeasons.Count());
            Field<IntGraphType>("GamesPlayed", resolve: context => context.Source.PlayerSeasons.Sum(x => x.GamesPlayed));
            Field<FloatGraphType>("AvgPositionRank", resolve: context => context.Source.PlayerSeasons.Average(x => x.PositionRank));
            Field<FloatGraphType>("AvgPositionRankPpg", resolve: context => context.Source.PlayerSeasons.Average(x => x.PositionRankPpg));
            Field<FloatGraphType>("Points", resolve: context => context.Source.PlayerSeasons.Sum(x => x.Points));
            Field<FloatGraphType>("PointsPerSeason", resolve: context => context.Source.PlayerSeasons.Sum(x => x.Points) / context.Source.PlayerSeasons.Count());
            Field<FloatGraphType>("PointsPerGame", resolve: context => context.Source.PlayerSeasons.Sum(x => x.Points) / context.Source.PlayerSeasons.Sum(x => x.GamesPlayed));

            Field< ListGraphType<PlayerSeason>>("seasons",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" }
                ),
                resolve: context =>
                {
                    var year = context.GetArgument<int?>("year");
                    return context.Source.PlayerSeasons.Where(p => !year.HasValue || p.Year == year).OrderByDescending(p => p.Year);
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
        }
    }
}
