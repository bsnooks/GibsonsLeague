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
            PlayerRepository playerRepository)
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
        }
    }
}
