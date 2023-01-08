using System.Threading.Tasks;
using GibsonsLeague.LiveDraft.Factories;
using GibsonsLeague.LiveDraft.Models;
using Microsoft.AspNetCore.SignalR;

namespace GibsonsLeague.Api.Hubs
{
    public class DraftHub : Hub<IDraftTeam>
    {
        private readonly DraftLobby _draftFactory;

        public DraftHub(DraftLobby draftFactory)
        {
            _draftFactory = draftFactory;
        }

        public async Task<string> JoinDraft()
        {
            GibsonsLeague.LiveDraft.Models.LiveDraft draft = await _draftFactory.AddTeamToDraftAsync(Context);

            return draft.Name;
        }
    }
}
