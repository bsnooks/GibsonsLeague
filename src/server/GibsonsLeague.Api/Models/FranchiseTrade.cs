using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class FranchiseTrade : ObjectGraphType<GibsonsLeague.Data.Models.FranchiseTrade>
    {

        public FranchiseTrade()
        {
            Field(x => x.TradeId);
            Field(x => x.Date);
            Field(x => x.Franchise.FranchiseId).Name("FranchiseId");
            Field(x => x.Franchise.MainName).Name("FranchiseName");
            Field("TradedWithFranchiseId", x => x.TradedWith.FranchiseId);
            Field(x => x.TradedWith.MainName).Name("TradedWithFranchiseName");

            Field<ListGraphType<PlayerTransaction>>("tradedfor",
                resolve: context =>
                {
                    return context.Source.TradedForTransactions;
                });

            Field<ListGraphType<PlayerTransaction>>("tradedaway",
                resolve: context =>
                {
                    return context.Source.TradedAwayTransactions;
                });
        }
    }
}
