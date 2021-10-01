using GibsonsLeague.Core;
using GibsonsLeague.Core.Models;
using Microsoft.AspNetCore.Http;

namespace GibsonsLeague.YahooSync
{
    public class YahooSyncContext : ISyncContext
    {
        public string Token { get; private set; }
        public League League { get; private set; }

        private YahooSyncContext(HttpContext httpContext, League league)
        {
            if (httpContext != null && httpContext.Items.ContainsKey("Token"))
            {
                Token = httpContext.Items["Token"].ToString();
            }

            League = league;
        }

        public static ISyncContext Create(HttpContext httpContext, League league) => new YahooSyncContext(httpContext, league);
    }
}
