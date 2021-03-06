﻿using GibsonsLeague.Data;
using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class PlayerTransaction : ObjectGraphType<GibsonsLeague.Data.Transaction>
    {
        public PlayerTransaction(TransactionRepository transactionRepository)
        {
            Field(x => x.TransactionId);
            Field(x => x.TransactionGroupId, nullable: true, type: typeof(GuidGraphType));
            Field(x => x.PlayerId);
            Field(x => x.Player.Name);
            Field(x => x.Player.Position);
            Field(x => x.Player.PrimaryPosition);
            Field(x => x.Description);
            Field(x => x.Date);
            Field(x => x.Date.Year);
            Field(x => x.Team.FranchiseId).Name("FranchiseId");
            Field(x => x.Team.Franchise.MainName).Name("FranchiseName");
            Field<StringGraphType>("type",
                resolve: context => context.Source.TransactionType.ToString());

            Field<ListGraphType<PlayerTransaction>>("related",
                resolve: context => transactionRepository.GetRelatedTransactions(context.Source.TransactionId, context.Source.TransactionGroupId));
        }
    }
}
