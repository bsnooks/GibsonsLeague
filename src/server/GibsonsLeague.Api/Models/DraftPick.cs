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
            Field(x => x.PositionPick);

            Field(x => x.PlayerId);
            Field(x => x.Player.Name).Name("playerName");
            Field(x => x.Player.Position).Name("playerPosition");
            Field(x => x.Team.FranchiseId).Name("franchiseId");
            Field(x => x.Team.Franchise.MainName).Name("franchiseName");
        }
    }
}
