using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Season : ObjectGraphType<GibsonsLeague.Core.Models.Season>
    {
        public Season(TeamRepository teamRepository, PlayerRepository playerRepository)
        {
            Field(x => x.Year);
            Field(x => x.Finished, nullable: true, type: typeof(BooleanGraphType));
            Field(x => x.YahooGameId, nullable: true, type: typeof(IntGraphType));
            Field(x => x.YahooLeagueId, nullable: true, type: typeof(IntGraphType));
            Field(x => x.KeepersSet, nullable: true, type: typeof(BooleanGraphType));
            Field(x => x.DraftImported, nullable: true, type: typeof(BooleanGraphType));
            Field(x => x.CurrentWeek, nullable: true, type: typeof(IntGraphType));
            Field(x => x.MatchupSyncWeek, nullable: true, type: typeof(IntGraphType));
            Field(x => x.WeeklyRosterSyncWeek, nullable: true, type: typeof(IntGraphType));
            Field(x => x.WeekStatsSyncWeek, nullable: true, type: typeof(IntGraphType));
            Field(x => x.LastTransactionSyncDate, nullable: true, type: typeof(DateTimeGraphType));

            Field<ListGraphType<Team>>("teams",
                resolve: context => teamRepository.GetTeams(
                    year: context.Source.Year));

            Field<ListGraphType<PlayerSeason>>("positionComparison",
                resolve: context =>
                {
                    return playerRepository.GetPlayerSeasonComparison(
                        years: new[] { context.Source.Year },
                        allSlices: true);
                });
        }
    }
}
