using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class TeamPlayer : ObjectGraphType<GibsonsLeague.Core.Models.TeamPlayer>
    {
        public TeamPlayer()
        {
            Field(p => p.PlayerId);
            Field(p => p.SeasonPoints);
            Field(p => p.TeamPoints);
            Field(p => p.PassYards);
            Field(p => p.PassTDs);
            Field(p => p.RushYards);
            Field(p => p.RushTDs);
            Field(p => p.RecYards);
            Field(p => p.RecTDs);
            Field(p => p.Interceptions);
            Field(p => p.FumblesLost);
            Field(p => p.TwoPointConvert);
            Field(p => p.GamesStarted);
            Field(p => p.GamesBenched);
            Field<Player>("player", resolve: context => context.Source.Player);
        }
    }
}
