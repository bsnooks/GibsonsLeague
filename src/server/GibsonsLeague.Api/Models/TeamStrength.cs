using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;
using System.Collections.Generic;

namespace GibsonsLeague.Api.Models
{
    public class TeamStrength : ObjectGraphType<KeyValuePair<string, string[]>>
    {
        public TeamStrength(AnalysisRepository analysisRepository)
        {
            Field(l => l.Key).Name("Position");
            Field("P1", l => l.Value[0], nullable: true, type: typeof(StringGraphType));
            Field("P2", l => l.Value[1], nullable: true, type: typeof(StringGraphType));
            Field("P3", l => l.Value[2], nullable: true, type: typeof(StringGraphType));
            Field("P4", l => l.Value[3], nullable: true, type: typeof(StringGraphType));
        }
    }
}
