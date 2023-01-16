using System.Threading;
using System.Threading.Tasks;
using GibsonsLeague.Data.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace GibsonsLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayoffPoolController : ControllerBase
    {
        private readonly PlayoffPoolRepository playoffPoolRepository;

        /// <summary>
        /// Creates a new <see cref="PlayoffPoolController"/>
        /// </summary>
        public PlayoffPoolController(PlayoffPoolRepository playoffPoolRepository)
        {
            this.playoffPoolRepository = playoffPoolRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPoolStatus(CancellationToken cancellationToken = default)
        {
            var result = await playoffPoolRepository.GetPlayoffPool(cancellationToken);
            return Ok(result);
        }
    }
    
}
