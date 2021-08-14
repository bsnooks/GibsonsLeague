using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Legend : ObjectGraphType<GibsonsLeague.Data.Models.Legend>
    {
        public Legend()
        {
            Field(x => x.Years);
            Field(x => x.Points);

            Field<Player>("player",
                resolve: context =>
                {
                    return context.Source.Player;
                });
        }
    }
}
