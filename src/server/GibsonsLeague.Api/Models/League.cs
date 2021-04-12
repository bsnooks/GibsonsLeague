using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class League : ObjectGraphType<GibsonsLeague.Data.League>
    {
        public League(DraftRepository draftRepository)
        {
            Field(l => l.LeagueId);
            Field(l => l.Name);
            Field(l => l.StartYear, nullable: true, type: typeof(IntGraphType));

            Field<ListGraphType<Franchise>>("franchises", resolve: context => context.Source.Franchises);
            Field<ListGraphType<Draft>>("drafts", resolve: context => draftRepository.GetAll());
            Field<Draft>("draft",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<IntGraphType>> { Name = "year" }),
                resolve: context => draftRepository.GetOneByYear(context.Source.LeagueId, context.GetArgument<int>("year")));
        }
    }
}
