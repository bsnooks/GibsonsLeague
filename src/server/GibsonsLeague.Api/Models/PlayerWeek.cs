using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class PlayerWeek : ObjectGraphType<GibsonsLeague.Core.Models.PlayerWeek>
    {
        public PlayerWeek()
        {
            Field(l => l.PlayerId);
            Field(l => l.Year);
            Field(l => l.Week);
            Field(l => l.Started);
            Field<StringGraphType>("franchiseName",
                resolve: context =>
                {
                    return context.Source.Team?.Franchise?.MainName ?? "";
                });
            Field<StringGraphType>("franchiseId",
                resolve: context =>
                {
                    return context.Source.Team?.FranchiseId ?? null;
                });
            Field(l => l.Points);
            Field(l => l.PassYards);
            Field(l => l.PassTDs);
            Field(l => l.RushYards);
            Field(l => l.RushTDs);
            Field(l => l.RecYards);
            Field(l => l.RecTDs);
            Field(l => l.Interceptions);
            Field(l => l.FumblesLost);
            Field(l => l.TwoPointConvert);
        }
    }
}
