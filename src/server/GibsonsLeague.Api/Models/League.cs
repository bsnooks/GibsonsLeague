using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class League : ObjectGraphType<GibsonsLeague.Data.League>
    {
        public League(DraftRepository draftRepository, FranchiseRepository franchiseRepository, RecordRepository recordRepository)
        {
            Field(l => l.LeagueId);
            Field(l => l.Name);
            Field(l => l.StartYear, nullable: true, type: typeof(IntGraphType));

            Field<ListGraphType<Franchise>>("franchises", resolve: context => franchiseRepository.GetAll());
            Field<ListGraphType<Draft>>("drafts", resolve: context => draftRepository.GetAll());
            Field<Draft>("draft",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "year" }),
                resolve: context => draftRepository.GetOneByYear(context.Source.LeagueId, context.GetArgument<int>("year")));

            Field<ListGraphType<LeagueRecords>>("records",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "number", DefaultValue = 1 },
                    new QueryArgument<BooleanGraphType> { Name = "positivity" }),
                resolve: context =>
                {
                    return recordRepository.GetLeagueRecords(context.Source.LeagueId,
                        context.GetArgument<int>("number"),
                        recordPositivity: context.GetArgument<bool?>("positivity"));
                });
        }
    }
}
