﻿using GibsonsLeague.Data.Repositories;
using GraphQL;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class Draft : ObjectGraphType<GibsonsLeague.Data.Draft>
    {
        public Draft(DraftPickRepository draftPickRepository)
        {
            Field(x => x.DraftId);
            Field(x => x.Year);
            Field(x => x.Date, nullable: true, type: typeof(DateGraphType));
            Field(x => x.Snake);
            Field(x => x.Rounds);
            Field<ListGraphType<DraftPick>>("picks",
                arguments: new QueryArguments(
                    new QueryArgument<IntGraphType> { Name = "round" },
                    new QueryArgument<IntGraphType> { Name = "pick" }),
                resolve: context =>
                {
                    return draftPickRepository.GetDraft(context.Source.DraftId,
                        round: context.GetArgument<int?>("round"),
                        pick: context.GetArgument<int?>("pick"));
                });
        }
    }
}
