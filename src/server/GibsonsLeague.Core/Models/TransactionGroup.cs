using System;
using System.Collections.Generic;



namespace GibsonsLeague.Core.Models
{
    public partial class TransactionGroup
    {
        public TransactionGroup()
        {
            Transactions = new HashSet<Transaction>();
        }

        public Guid TransactionGroupId { get; set; }
        public DateTime Date { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
