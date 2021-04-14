using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Match : ObjectGraphType<GibsonsLeague.Data.Match>
    {
        public Match()
        {
            Field<StringGraphType>("type",
                resolve: context => context.Source.MatchTypeId.ToString());
            Field(x => x.Year);
            Field(x => x.Week);
            Field(x => x.WinningTeam.Franchise.MainName).Name("WinningFranchise");
            Field(x => x.LosingTeam.Franchise.MainName).Name("LosingFranchise");
            Field(x => x.Tied);
        }
    }
}
