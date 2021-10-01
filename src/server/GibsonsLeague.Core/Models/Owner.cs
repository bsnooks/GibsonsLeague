using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class Owner
    {
        public Owner()
        {
            Teams = new HashSet<Team>();
        }

        public Guid FranchiceId { get; set; }
        public Guid OwnerId { get; set; }
        public string Name { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? Active { get; set; }

        public virtual Franchise Franchice { get; set; }
        public virtual ICollection<Team> Teams { get; set; }
    }
}
