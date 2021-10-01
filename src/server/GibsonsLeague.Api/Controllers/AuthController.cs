using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace GibsonsLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration configuration;

        public AuthController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet("yahoo")]
        [AllowAnonymous]
        public async Task<IActionResult> GetToken(string code, string redirectUri)
        {
            HttpClient client = new HttpClient();

            string clientId = configuration["Yahoo:ClientId"];
            string clientSecret = configuration["Yahoo:ClientSecret"];

            var contentParams = new List<KeyValuePair<string, string>>()
            {
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", code),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
            };

            var response = await client.PostAsync("https://api.login.yahoo.com/oauth2/get_token", new FormUrlEncodedContent(contentParams));

            if (response.StatusCode == System.Net.HttpStatusCode.OK)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                return new OkObjectResult(JsonConvert.DeserializeObject<IDictionary<string, object>>(responseBody));
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                return new BadRequestObjectResult(JsonConvert.DeserializeObject<IDictionary<string, object>>(responseBody));
            }

            return new ForbidResult();
        }
    }
}
