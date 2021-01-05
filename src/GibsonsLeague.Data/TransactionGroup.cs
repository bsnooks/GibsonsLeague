using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class TransactionGroup
    {
        public TransactionGroup()
        {
            Transactions = new HashSet<Transaction>();
        }

        public Guid TransactionGroupId { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
