using GibsonsLeague.Core.Models;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class PlayerSeason : ObjectGraphType<GibsonsLeague.Core.Models.PlayerSeason>
    {
        public PlayerSeason(TransactionRepository transactionRepository)
        {
            Field(l => l.Player.Name);
            Field(l => l.Player.Position);
            Field(l => l.Player.PrimaryPosition);
            Field(l => l.PlayerId);
            Field(l => l.Year);
            Field(l => l.PositionRank);
            Field(l => l.PositionRankPpg);
            Field(l => l.GamesPlayed);
            Field(l => l.Points);
            Field<StringGraphType>("endfranchisecolor",
                resolve: context =>
                {
                    return context.Source.EndTeam?.Franchise?.Color ?? "";
                });
            Field<StringGraphType>("endfranchise",
                resolve: context =>
                {
                    return context.Source.EndTeam?.Franchise?.MainName ?? "";
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
                        year: context.Source.Year,
                        type: context.GetArgument<TransactionType?>("type"));
                });
        }
    }
}
