using System.Linq;
using GraphQL;
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
            Field(x => x.Player.PrimaryPosition).Name("playerPrimaryPosition");
            Field(x => x.Team.FranchiseId).Name("franchiseId");
            Field(x => x.Team.Franchise.MainName).Name("franchiseName");

            Field<IntGraphType>("playerPositionRank",
                resolve: context =>
                {
                    var match = context.Source.Player.PlayerSeasons.FirstOrDefault(p => p.Year == context.Source.Draft.Year);
                    return match?.PositionRank ?? (int?)null;
                });

            Field<IntGraphType>("playerPositionRankPpg",
                resolve: context =>
                {
                    var match = context.Source.Player.PlayerSeasons.FirstOrDefault(p => p.Year == context.Source.Draft.Year);
                    return match?.PositionRankPpg ?? (int?)null;
                });

            Field<FloatGraphType>("points",
                resolve: context =>
                {
                    var match = context.Source.Player.PlayerSeasons.FirstOrDefault(p => p.Year == context.Source.Draft.Year);
                    return match?.Points ?? null;
                });

            Field<IntGraphType>("gamesPlayed",
                resolve: context =>
                {
                    var match = context.Source.Player.PlayerSeasons.FirstOrDefault(p => p.Year == context.Source.Draft.Year);
                    return match?.GamesPlayed ?? null;
                });
        }
    }
}
