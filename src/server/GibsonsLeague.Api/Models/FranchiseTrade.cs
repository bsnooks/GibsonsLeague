using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class FranchiseTrade : ObjectGraphType<GibsonsLeague.Core.Models.FranchiseTrade>
    {

        public FranchiseTrade()
        {
            Field(x => x.TradeId);
            Field(x => x.Date);
            Field(x => x.Franchise.FranchiseId).Name("FranchiseId");
            Field(x => x.Franchise.MainName).Name("FranchiseName");
            Field("TradedWithFranchiseId", x => x.TradedWith != null ? x.TradedWith.FranchiseId :(Guid?)null, nullable: true, type: typeof(GuidGraphType));
            Field("TradedWithFranchiseName", x => x.TradedWith != null ? x.TradedWith.MainName : string.Empty, nullable: true, type: typeof(StringGraphType));

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
