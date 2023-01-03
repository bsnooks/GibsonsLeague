using GibsonsLeague.Core.Models;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Team : ObjectGraphType<GibsonsLeague.Core.Models.Team>
    {
        public Team(MatchRepository matchRepository, PlayerRepository playerRepository)
        {
            Field(x => x.Year);
            Field(x => x.Name);
            Field(x => x.FranchiseId);
            Field(x => x.Franchise.MainName).Name("FranchiseName");
            Field("Owner", x => x.Owner.Name);
            Field(x => x.YahooTeamId, nullable: true, type: typeof(IntGraphType));
            Field(x => x.Wins);
            Field(x => x.Loses);
            Field(x => x.Ties);
            Field(x => x.Points);
            Field(x => x.Standing);
            Field(x => x.Champion);
            Field(x => x.SecondPlace);

            Field<ListGraphType<Match>>("matches",
                arguments: new QueryArguments(
                    new QueryArgument<MatchTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "week" }),
                resolve: context => matchRepository.GetMatches(
                    offset: 0,
                    limit: 20,
                    franchiseId: context.Source.FranchiseId,
                    type: context.GetArgument<MatchType?>("type"),
                    year: context.Source.Year,
                    week: context.GetArgument<int?>("week")));

            Field<ListGraphType<TeamPlayer>>("players",
                arguments: new QueryArguments(
                    new QueryArgument<BooleanGraphType> { Name = "started", DefaultValue = true },
                    new QueryArgument<BooleanGraphType> { Name = "currentRoster", DefaultValue = true }),
                resolve: context => playerRepository.GetPlayersByTeam(
                    team: context.Source,
                    currentRoster: context.GetArgument<bool?>("currentRoster"),
                    started: context.GetArgument<bool?>("started")));
        }
    }
}
