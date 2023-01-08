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

        [HttpPost("week")]
        public async Task<IActionResult> SyncCurrentWeek([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncCurrentWeek(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("keepers")]
        public async Task<IActionResult> SyncKeepers([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncKeepers(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("draft")]
        public async Task<IActionResult> SyncDraft([FromBody]SyncSeasonRequest request, CancellationToken cancellationToken = default)
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
        public async Task<IActionResult> SyncTransactions([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
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
        public async Task<IActionResult> SyncMatchups([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
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
        public async Task<IActionResult> SyncStandings([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
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
        public async Task<IActionResult> SyncPlayerStats([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncPlayerStats(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("rosters")]
        public async Task<IActionResult> SyncPlayerRoster([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncPlayerRoster(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("rosters/week")]
        public async Task<IActionResult> SyncWeeklyRoster([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncWeeklyRoster(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }

        [HttpPost("playerstats/week")]
        public async Task<IActionResult> SyncWeeklyPlayerStats([FromBody] SyncSeasonRequest request, CancellationToken cancellationToken = default)
        {
            _ = yahooSyncService.SyncWeeklyPlayerStats(
                YahooSyncContext.Create(
                    Request.HttpContext,
                    await leagueRepository.GetOne(request.LeagueId)),
                await seasonRepository.GetSeason(request.Year),
                cancellationToken);

            return new NoContentResult();
        }
    }
    
}
