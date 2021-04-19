using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Team : ObjectGraphType<GibsonsLeague.Data.Team>
    {
        public Team(MatchRepository matchRepository)
        {
            Field(x => x.Year);
            Field(x => x.Name);
            Field(x => x.FranchiseId);
            Field(x => x.Franchise.MainName).Name("FranchiseName");
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
        }
    }
}
