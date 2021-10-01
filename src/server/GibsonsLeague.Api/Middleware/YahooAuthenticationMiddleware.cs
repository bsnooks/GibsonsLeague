using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace GibsonsLeague.Api.Middleware
{
    public class YahooAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public YahooAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            string authHeader = context.Request.Headers["Authorization"];
            if (authHeader != null && authHeader.StartsWith("Bearer"))
            {
                try
                {
                    var token = authHeader.Replace("Bearer", "").Trim();
                    context.Items["Token"] = token;
                }
                catch { }
            }

            await _next(context);
        }
    }
}
