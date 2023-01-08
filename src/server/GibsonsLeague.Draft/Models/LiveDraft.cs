using GibsonsLeague.LiveDraft.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace GibsonsLeague.LiveDraft.Models
{
    public class LiveDraft
    {
        private readonly IHubContext<DraftHub, IDraftTeam> hubContext;
        private readonly IHttpClientFactory httpClientFactory;

        public LiveDraft(IHubContext<DraftHub, IDraftTeam> hubContext,
            IHttpClientFactory httpClientFactory)
        {
            this.hubContext = hubContext;
            this.httpClientFactory = httpClientFactory;

            Name = Guid.NewGuid().ToString();
        }

        /// <summary>
        /// The name of the live draft.
        /// </summary>
        public string Name { get; set; } = string.Empty;


        public async Task<bool> AddTeamAsync(string connectionId)
        {
            await hubContext.Groups.AddToGroupAsync(connectionId, Name);

            return true;
        }
    }
}
