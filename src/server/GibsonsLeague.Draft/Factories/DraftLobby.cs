using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;

namespace GibsonsLeague.LiveDraft.Factories
{
    public class DraftLobby
    {
        private readonly IServiceProvider serviceProvider;

        // The key into the per connection dictionary used to look up the current game;
        private static readonly object _gameKey = new();

        public DraftLobby(IServiceProvider serviceProvider)
        {
            this.serviceProvider = serviceProvider;
        }

        public Task<Models.LiveDraft?> AddTeamToDraftAsync(HubCallerContext hubCallerContext)
        {
            // There's already a game associated with this player, just return it
            if (hubCallerContext.Items[_gameKey] is GibsonsLeague.LiveDraft.Models.LiveDraft d)
            {
                return Task.FromResult(d);
            }

            var newDraft = serviceProvider.GetService<Models.LiveDraft>();

            return Task.FromResult(newDraft);
        }
    }
}
