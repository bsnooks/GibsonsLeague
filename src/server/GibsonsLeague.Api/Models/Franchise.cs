using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Franchise : ObjectGraphType<GibsonsLeague.Data.Franchise>
    {
        public Franchise(DraftPickRepository draftPickRepository, TransactionRepository transactionRepository)
        {
            Field(f => f.FranchiseId);
            Field(f => f.MainName);

            Field<ListGraphType<DraftPick>>("picks",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<IntGraphType> { Name = "round" },
                    new QueryArgument<IntGraphType> { Name = "pick" }),
                resolve: context =>
                {
                    return draftPickRepository.GetPicks(context.Source.FranchiseId,
                        context.GetArgument<int?>("year"),
                        context.GetArgument<int?>("round"),
                        context.GetArgument<int?>("pick"));
                });

            Field<ListGraphType<PlayerTransaction>>("transactions",
                arguments: new QueryArguments(
                    new QueryArgument<TransactionTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "year" }),
                resolve: context => transactionRepository.GetTransactions(
                    franchiseId: context.Source.FranchiseId,
                    type: context.GetArgument<TransactionType?>("type"),
                    year: context.GetArgument<int?>("year")));
        }
    }
}
