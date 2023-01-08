using GibsonsLeague.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace GibsonsLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IYahooAuthService authService;

        public AuthController(IYahooAuthService authService)
        {
            this.authService = authService;
        }

        [HttpGet("yahoo")]
        [AllowAnonymous]
        public async Task<IActionResult> GetToken(string code, string redirectUri)
        {
            try
            {
                var result = await authService.AuthenticateCode(code, redirectUri);
                return new OkObjectResult(result);
            }
            catch (UnauthorizedAccessException)
            {
                return new ForbidResult();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}
