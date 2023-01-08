using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace GibsonsLeague.Auth
{
    public class YahooAuthService : IYahooAuthService
    {
        private readonly IConfiguration configuration;

        public YahooAuthService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task<AuthResponse> AuthenticateCode(string code, string redirectUri)
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
                var parsedResponse = JsonConvert.DeserializeObject<IDictionary<string, object>>(responseBody);
                if (parsedResponse != null)
                {
                    var result = new AuthResponse()
                    {
                        Token = GetPropertyFromParsedResponse<string>(parsedResponse, "access_token"),
                        IdToken = GetPropertyFromParsedResponse<string>(parsedResponse, "id_token"),
                        RefreshToken = GetPropertyFromParsedResponse<string>(parsedResponse, "refresh_token"),
                        ExpiresIn = GetPropertyFromParsedResponse<int>(parsedResponse, "expires_in"),
                    };

                    client.DefaultRequestHeaders.Add("Authorization", $"Bearer {result.Token}");
                    var userInfoResponse = await client.GetAsync("https://api.login.yahoo.com/openid/v1/userinfo");
                    if (userInfoResponse != null && userInfoResponse.StatusCode == System.Net.HttpStatusCode.OK)
                    {
                        responseBody = await userInfoResponse.Content.ReadAsStringAsync();
                        parsedResponse = JsonConvert.DeserializeObject<IDictionary<string, object>>(responseBody);
                        if (parsedResponse != null)
                        {
                            result.Username = GetPropertyFromParsedResponse<string>(parsedResponse, "email");
                            result.Username = GetPropertyFromParsedResponse<string>(parsedResponse, "given_name", result.Username);
                        }
                    }

                    return result;
                }

            }
            else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
            {
                var responseBody = await response.Content.ReadAsStringAsync();
                var parsedResponse = JsonConvert.DeserializeObject<IDictionary<string, object>>(responseBody);
            }

            throw new UnauthorizedAccessException();
        }

        private static T GetPropertyFromParsedResponse<T>(IDictionary<string, object> parsedResponse, string key, T defaultValue = default)
        {

            if (parsedResponse != null && !string.IsNullOrEmpty(key) && parsedResponse.ContainsKey(key))
            {
                Type type = typeof(T);

                if (type == typeof(string))
                {
                    return (T)(object)(parsedResponse[key].ToString() ?? string.Empty);
                }
                else if (type == typeof(int) && int.TryParse(parsedResponse[key].ToString(), out int intValue))
                {
                    return (T)(object)intValue;
                }
            }

            return defaultValue;
        }
    }
}
