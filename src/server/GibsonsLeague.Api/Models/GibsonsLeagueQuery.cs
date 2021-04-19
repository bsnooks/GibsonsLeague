using System;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class GibsonsLeagueQuery : ObjectGraphType
    {
        public GibsonsLeagueQuery(
            LeagueRepository leagueRepository,
            FranchiseRepository franchiseRepository,
            PlayerRepository playerRepository,
            FranchiseTradeRepository franchiseTradeRepository,
            DraftRepository draftRepository,
            DraftPickRepository draftPickRepository,
            TransactionRepository transactionRepository,
            SeasonRepository seasonRepository)
        {
            Field<ListGraphType<League>>(
                "leagues",
                resolve: context => leagueRepository.GetAll()
            );

            Field<League>(
                "league",
                arguments: new QueryArguments(
                    new QueryArgument<GuidGraphType> { Name = "id" },
                    new QueryArgument<StringGraphType> { Name = "name", DefaultValue="Gibsons League" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<Guid?>("id");
                    var name = context.GetArgument<string>("name");
                    return id.HasValue ? leagueRepository.GetOne(id.Value) : leagueRepository.GetOneByName(name);
                }
            );

            Field<ListGraphType<Franchise>>(
                "franchises",
                resolve: context => franchiseRepository.GetAll()
            );

            Field<Franchise>(
                "franchise",
                arguments: new QueryArguments(
                    new QueryArgument<GuidGraphType> { Name = "id" },
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<Guid?>("id");
                    var name = context.GetArgument<string>("name");
                    return id.HasValue ? franchiseRepository.GetOne(id.Value) : franchiseRepository.GetOneByName(name);
                }
            );

            Field<Season>(
                "season",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<GuidGraphType> { Name = "franchiseId" }
                ),
                resolve: context =>
                {
                    return seasonRepository.GetSeason(
                        year: context.GetArgument<int>("year"));
                });

            Field<Player>(
                "player",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "id" },
                    new QueryArgument<StringGraphType> { Name = "name" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int?>("id");
                    var name = context.GetArgument<string>("name");
                    return id.HasValue ? playerRepository.GetOne(id.Value) : playerRepository.GetOneByName(name);
                });

            Field<ListGraphType<Player>>(
                "players",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset", DefaultValue=0 },
                    new QueryArgument<IntGraphType> { Name = "limit", DefaultValue=10 },
                    new QueryArgument<StringGraphType> { Name = "query" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int?>("id");
                    var name = context.GetArgument<string>("name");
                    return playerRepository.LookupPlayer(
                        offset: context.GetArgument<int>("offset"),
                        limit: context.GetArgument<int>("limit"),
                        name: context.GetArgument<string>("query"));
                });

            Field<FranchiseTrade>(
                "trade",
                arguments: new QueryArguments(
                    new QueryArgument<GuidGraphType> { Name = "id" }
                ),
                resolve: context =>
                {
                    return franchiseTradeRepository.GetFranchiseTrade(context.GetArgument<Guid>("id"));
                });

            Field<ListGraphType<FranchiseTrade>>(
                "trades",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset", DefaultValue = 0 },
                    new QueryArgument<IntGraphType> { Name = "limit", DefaultValue = 100 },
                    new QueryArgument<GuidGraphType> { Name = "franchiseId", DefaultValue = null },
                    new QueryArgument<IntGraphType> { Name = "year", DefaultValue = null }
                ),
                resolve: context =>
                {
                    return franchiseTradeRepository.GetFranchiseTrades(
                        limit: context.GetArgument<int>("limit"),
                        offset: context.GetArgument<int>("offset"),
                        franchiseId: context.GetArgument<Guid?>("franchiseId"),
                        year: context.GetArgument<int?>("year"));
                });

            Field<Draft>(
                "draft",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" }
                ),
                resolve: context =>
                {
                    return draftRepository.GetOneByYear(context.GetArgument<int>("year"));
                });

            Field<ListGraphType<DraftPick>>(
                "draftpicks",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset", DefaultValue = 0 },
                    new QueryArgument<IntGraphType> { Name = "limit", DefaultValue = 1000 },
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<GuidGraphType> { Name = "franchiseId" }
                ),
                resolve: context =>
                {
                    return draftPickRepository.GetPicks(
                        offset: context.GetArgument<int>("offset"),
                        limit: context.GetArgument<int>("limit"),
                        year: context.GetArgument<int?>("year"),
                        franchiseId: context.GetArgument<Guid?>("franchiseId"));
                });

            Field<ListGraphType<PlayerTransaction>>(
                "transactions",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset", DefaultValue = 0 },
                    new QueryArgument<IntGraphType> { Name = "limit", DefaultValue = 1000 },
                    new QueryArgument<TransactionTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<GuidGraphType> { Name = "franchiseId" }
                ),
                resolve: context =>
                {
                    return transactionRepository.GetTransactions(
                        offset: context.GetArgument<int>("offset"),
                        limit: context.GetArgument<int>("limit"),
                        type: context.GetArgument<TransactionType?>("type"),
                        year: context.GetArgument<int?>("year"),
                        franchiseId: context.GetArgument<Guid?>("franchiseId"));
                });
        }
    }
}
