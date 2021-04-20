using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class PlayerSeason : ObjectGraphType<GibsonsLeague.Data.PlayerSeason>
    {
        public PlayerSeason(TransactionRepository transactionRepository)
        {
            Field(l => l.Player.Name);
            Field(l => l.Player.Position);
            Field(l => l.PlayerId);
            Field(l => l.Year);
            Field(l => l.PositionRank);
            Field(l => l.PositionRankPpg);
            Field(l => l.GamesPlayed);
            Field(l => l.Points);

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
