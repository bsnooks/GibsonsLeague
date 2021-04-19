﻿using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Player : ObjectGraphType<GibsonsLeague.Data.Player>
    {
        public Player(TransactionRepository transactionRepository)
        {
            Field(l => l.PlayerId);
            Field(l => l.Name);
            Field(l => l.Position);
            Field(l => l.PrimaryPosition);
            Field(x => x.YahooPlayerId, nullable: true, type: typeof(IntGraphType));

            Field<ListGraphType<PlayerTransaction>>("transactions",
                arguments: new QueryArguments(
                    new QueryArgument<TransactionTypeEnum> { Name = "type" },
                    new QueryArgument<IntGraphType> { Name = "offset" },
                    new QueryArgument<IntGraphType> { Name = "limit" }),
                resolve: context =>
                {
                    return transactionRepository.GetTransactions(
                        offset: context.GetArgument<int>("offset", 0),
                        limit: context.GetArgument<int>("limit", 20),
                        playerId: context.Source.PlayerId,
                        type: context.GetArgument<TransactionType?>("type"));
                });
        }
    }
}
