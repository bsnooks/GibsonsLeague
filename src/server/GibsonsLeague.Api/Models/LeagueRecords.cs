using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class LeagueRecords : ObjectGraphType<GibsonsLeague.Core.Models.LeagueRecords>
    {

        public LeagueRecords()
        {
            Field(x => x.RecordTitle);
            Field(x => x.PositiveRecord);
            Field<StringGraphType>("type",
                resolve: context => context.Source.RecordType.ToString());

            Field<ListGraphType<LeagueRecord>>("top",
                resolve: context =>
                {
                    return context.Source.Records;
                });
        }
    }
}
