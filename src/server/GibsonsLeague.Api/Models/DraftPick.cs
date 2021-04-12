using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class DraftPick : ObjectGraphType<GibsonsLeague.Data.DraftPick>
    {
        public DraftPick()
        {
            Field(x => x.DraftId);
            Field(x => x.Draft.Year).Name("year");
            Field(x => x.Round);
            Field(x => x.Pick);
            Field(x => x.Player.Name).Name("playerName");
        }
    }
}
