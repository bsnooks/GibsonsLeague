using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;
using System;

namespace GibsonsLeague.Api.Models
{
    public class LeagueRecord : ObjectGraphType<GibsonsLeague.Core.Models.LeagueRecord>
    {

        public LeagueRecord()
        {
            Field(x => x.Rank);
            Field(x => x.RecordValue);
            Field(x => x.RecordNumericValue);
            Field<GuidGraphType>("FranchiseId",
                resolve: x => x.Source.Franchise != null ? x.Source.Franchise.FranchiseId : (Guid?)null);
            Field<StringGraphType>("FranchiseName",
                resolve: x => x.Source.Franchise != null ? x.Source.Franchise.MainName : null);
            Field<GuidGraphType>("OtherFranchiseId",
                resolve: x => x.Source.OtherFranchise != null ? x.Source.OtherFranchise.FranchiseId : (Guid?)null);
            Field<StringGraphType>("OtherFranchiseName",
                resolve: x => x.Source.OtherFranchise != null ? x.Source.OtherFranchise.MainName : null);
            Field<IntGraphType>("PlayerId",
                resolve: x => x.Source.Player != null ? x.Source.Player.PlayerId : (int?)null);
            Field<StringGraphType>("PlayerName",
                resolve: x => x.Source.Player != null ? x.Source.Player.Name : null);
            Field<StringGraphType>("PlayerPosition",
                resolve: x => x.Source.Player != null ? x.Source.Player.PrimaryPosition : null);
            Field(x => x.Year, nullable: true, type: typeof(IntGraphType));
            Field(x => x.Week, nullable: true, type: typeof(IntGraphType));
        }
    }
}
