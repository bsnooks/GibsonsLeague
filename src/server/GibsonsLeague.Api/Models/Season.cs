using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Season : ObjectGraphType<GibsonsLeague.Data.Season>
    {
        public Season(TeamRepository teamRepository)
        {
            Field(x => x.Year);
            Field(x => x.Finished, nullable: true, type: typeof(BooleanGraphType));
            Field(x => x.YahooGameId, nullable: true, type: typeof(IntGraphType));

            Field<ListGraphType<Team>>("teams",
                resolve: context => teamRepository.GetTeams(
                    year: context.Source.Year));
        }
    }
}
