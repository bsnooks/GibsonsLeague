using System.Linq;
using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Franchise : ObjectGraphType<GibsonsLeague.Data.Franchise>
    {
        public Franchise(TeamRepository teamRepository,
            DraftPickRepository draftPickRepository,
            TransactionRepository transactionRepository,
            MatchRepository matchRepository,
            FranchiseTradeRepository franchiseTradeRepository)
        {
            Field(f => f.FranchiseId);
            Field(f => f.MainName);
            Field<IntGraphType>("Wins", resolve: context => context.Source.Teams.Sum(x => x.Wins));
            Field<IntGraphType>("Loses", resolve: context => context.Source.Teams.Sum(x => x.Loses));
            Field<IntGraphType>("Ties", resolve: context => context.Source.Teams.Sum(x => x.Ties));
            Field<IntGraphType>("Championships", resolve: context => context.Source.Teams.Count(x => x.Champion));
            Field<IntGraphType>("RunnerUps", resolve: context => context.Source.Teams.Count(x => x.SecondPlace));
            Field<FloatGraphType>("Points", resolve: context => context.Source.Teams.Sum(x => x.Points));
            Field<IntGraphType>("TradeCount", resolve: context => context.Source.Teams.Sum(x => x.Transactions.Where(t => t.TransactionType == TransactionType.Traded).GroupBy(t => t.TransactionGroupId).Count()));
            Field<IntGraphType>("AddCount", resolve: context => context.Source.Teams.Sum(x => x.Transactions.Count(t => t.TransactionType == TransactionType.Added)));
            Field<IntGraphType>("DropCount", resolve: context => context.Source.Teams.Sum(x => x.Transactions.Count(t => t.TransactionType == TransactionType.Dropped)));

            Field<ListGraphType<Team>>("teams",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "year" }),
                resolve: context =>
                {
                    return teamRepository.GetTeams(
                        franchiseId: context.Source.FranchiseId,
                        year: context.GetArgument<int?>("year"));
                });

            Field<ListGraphType<DraftPick>>("picks",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" },
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<IntGraphType> { Name = "round" },
                    new QueryArgument<IntGraphType> { Name = "pick" }),
                resolve: context =>
                {
                    return draftPickRepository.GetPicks(
                        offset: context.GetArgument<int>("offset", 0),
                        limit: context.GetArgument<int>("limit", 20),
                        franchiseId: context.Source.FranchiseId,
                        year: context.GetArgument<int?>("year"),
                        round: context.GetArgument<int?>("round"),
                        pick: context.GetArgument<int?>("pick"));
                });

            Field<ListGraphType<FranchiseTrade>>("trades",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" }),
                resolve: context => franchiseTradeRepository.GetFranchiseTrades(
                    offset: context.GetArgument<int>("offset", 0),
                    limit: context.GetArgument<int>("limit", 20),
                    franchiseId: context.Source.FranchiseId));

            Field<ListGraphType<Match>>("matches",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" },
                    new QueryArgument<MatchTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "year" },
                    new QueryArgument<IntGraphType> { Name = "week" }),
                resolve: context => matchRepository.GetMatches(
                    offset: context.GetArgument<int>("offset", 0),
                    limit: context.GetArgument<int>("limit", 20),
                    franchiseId: context.Source.FranchiseId,
                    type: context.GetArgument<MatchType?>("type"),
                    year: context.GetArgument<int?>("year"),
                    week: context.GetArgument<int?>("week")));

        }
    }
}
