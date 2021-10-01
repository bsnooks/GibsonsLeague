using GibsonsLeague.Api.Models.Request;
using GibsonsLeague.Data.Repositories;
using GibsonsLeague.YahooSync;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace GibsonsLeague.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YahooSyncController : ControllerBase
    {
        private readonly IYahooSyncService yahooSyncService;
        private readonly LeagueRepository leagueRepository;
        private readonly SeasonRepository seasonRepository;

        /// <summary>
        /// Creates a new <see cref="YahooSyncController"/>
        /// </summary>
        public YahooSyncController(IYahooSyncService yahooSyncService,
            LeagueRepository leagueRepository,
            SeasonRepository seasonRepository)
        {
            this.yahooSyncService = yahooSyncService;
            this.leagueRepository = leagueRepository;
            this.seasonRepository = seasonRepository;
        }

        [HttpPost("draft")]
        public async Task<IActionResult> SyncDraft([FromBody]SyncDraftRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncDraft(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("transactions")]
        public async Task<IActionResult> SyncTransactions([FromBody] SyncTransactionsRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncTransactions(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("matchups")]
        public async Task<IActionResult> SyncMatchups([FromBody] SyncTransactionsRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncMatchups(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("standings")]
        public async Task<IActionResult> SyncStandings([FromBody] SyncTransactionsRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncStandings(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("playerstats")]
        public async Task<IActionResult> SyncPlayerStats([FromBody] SyncTransactionsRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncPlayerStats(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }
    }
    
}
