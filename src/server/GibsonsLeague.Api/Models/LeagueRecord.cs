using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;
using System;

namespace GibsonsLeague.Api.Models
{
    public class LeagueRecord : ObjectGraphType<GibsonsLeague.Data.Models.LeagueRecord>
    {

        public LeagueRecord()
        {
            Field(x => x.Rank);
            Field(x => x.RecordValue);
            Field(x => x.RecordNumericValue);
            Field(x => x.Franchise.FranchiseId).Name("FranchiseId");
            Field(x => x.Franchise.MainName).Name("FranchiseName");
            Field<GuidGraphType>("OtherFranchiseId",
                resolve: x => x.Source.OtherFranchise != null ? x.Source.OtherFranchise.FranchiseId : (Guid?)null);
            Field<StringGraphType>("OtherFranchiseName",
                resolve: x => x.Source.OtherFranchise != null ? x.Source.OtherFranchise.MainName : null);
            Field(x => x.Year, nullable: true, type: typeof(IntGraphType));
            Field(x => x.Week, nullable: true, type: typeof(IntGraphType));
        }
    }
}
