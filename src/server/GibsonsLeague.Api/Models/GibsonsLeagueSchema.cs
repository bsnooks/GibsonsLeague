using System;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;

namespace GibsonsLeague.Api.Models
{
    public class GibsonsLeagueSchema : Schema
    {
        public GibsonsLeagueSchema(IServiceProvider provider) : base(provider)
        {
            Query = provider.GetRequiredService<GibsonsLeagueQuery>();
        }
    }
}
