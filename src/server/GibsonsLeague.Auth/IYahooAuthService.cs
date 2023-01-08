using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace GibsonsLeague.Auth
{
    public interface IYahooAuthService
    {
        Task<AuthResponse> AuthenticateCode(string code, string redirectUri);
    }
}
