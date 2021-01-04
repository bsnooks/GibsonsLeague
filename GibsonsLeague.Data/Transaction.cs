using System;
using System.Collections.Generic;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class Transaction
    {
        public Guid TransactionId { get; set; }
        public Guid? TransactionGroupId { get; set; }
        public Guid TeamId { get; set; }
        public TransactionType TransactionType { get; set; }
        public int PlayerId { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public Guid? DraftPickId { get; set; }

        public virtual DraftPick DraftPick { get; set; }
        public virtual Player Player { get; set; }
        public virtual Team Team { get; set; }
        public virtual TransactionGroup TransactionGroup { get; set; }
    }
}
