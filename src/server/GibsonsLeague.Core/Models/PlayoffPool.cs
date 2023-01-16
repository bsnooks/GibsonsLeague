using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GibsonsLeague.Core.Models
{
    public class PlayoffPool
    {
        public ICollection<PlayoffPoolTeam> Teams { get; set; } = new List<PlayoffPoolTeam>();
        public ICollection<PlayoffPoolPlayer> Players { get; set; } = new List<PlayoffPoolPlayer>();
    }
    public class PlayoffPoolTeam
    {
        public Guid FranchiseId { get; set; }
        public string Name { get; set; }
        public double Points { get; set; } = 0;
        public int GamesPlayed { get; set; } = 0;
        public int PlayersRemaining { get; set; } = 0;
    }
    public class PlayoffPoolPlayer
    {
        [Key]
        public int PlayerId { get; set; }
        public string Name { get; set; }
        public Guid FranchiseId { get; set; }
        public double Points { get; set; } = 0;
        public int GamesPlayed { get; set; } = 0;
        public bool Eliminated { get; set; } = false;
        public int Pick { get; set; } = 0;
    }
}
