using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Match : ObjectGraphType<GibsonsLeague.Core.Models.Match>
    {
        public Match()
        {
            Field<StringGraphType>("type",
                resolve: context => context.Source.MatchTypeId.ToString());
            Field(x => x.Year);
            Field(x => x.Week);

            Field(x => x.WinningTeam.FranchiseId).Name("WinningFranchiseId");
            Field(x => x.WinningTeam.Franchise.MainName).Name("WinningFranchise");
            Field(x => x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week).Points).Name("WinningTeamPoints");
            Field(x => x.WinningTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week).ProjectedPoints, nullable: true, type: typeof(FloatGraphType)).Name("WinningTeamProjectedPoints");

            Field(x => x.LosingTeam.FranchiseId).Name("LosingFranchiseId");
            Field(x => x.LosingTeam.Franchise.MainName).Name("LosingFranchise");
            Field(x => x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week).Points).Name("LosingFranchisePoints");
            Field(x => x.LosingTeam.TeamScores.FirstOrDefault(s => s.Week == x.Week).ProjectedPoints, nullable: true, type: typeof(FloatGraphType)).Name("LosingFranchiseProjectedPoints");

            Field(x => x.Tied);
        }
    }
}
