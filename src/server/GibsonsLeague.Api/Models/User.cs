using GibsonsLeague.Data.Repositories;
using GraphQL.Types;

namespace GibsonsLeague.Api.Models
{
    public class User : ObjectGraphType<GibsonsLeague.Core.Models.User>
    {
        public User()
        {
            Field(x => x.UserName);
        }
    }
}
