using GibsonsLeague.Core.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace GibsonsLeague.Core
{
    public interface ISyncContext
    {
        string Token { get; }
        League League { get; }
    }
}
