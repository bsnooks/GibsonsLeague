using System;
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
            DraftRepository draftRepository)
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
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" },
                    new QueryArgument<StringGraphType> { Name = "query" }
                ),
                resolve: context =>
                {
                    var id = context.GetArgument<int?>("id");
                    var name = context.GetArgument<string>("name");
                    return playerRepository.LookupPlayer(
                        offset: context.GetArgument<int>("offset", 0),
                        limit: context.GetArgument<int>("limit", 20),
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

            Field<Draft>(
                "draft",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" }
                ),
                resolve: context =>
                {
                    return draftRepository.GetOneByYear(context.GetArgument<int>("year"));
                });
        }
    }
}
