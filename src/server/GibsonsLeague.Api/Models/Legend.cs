using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Legend : ObjectGraphType<GibsonsLeague.Core.Models.Legend>
    {
        public Legend()
        {
            Field(x => x.Years);
            Field(x => x.Points);
            Field(x => x.GamesPlayed);

            Field<Player>("player",
                resolve: context =>
                {
                    return context.Source.Player;
                });
        }
    }
}
