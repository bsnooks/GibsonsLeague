using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GibsonsLeague.Core.Models
{
    public partial class PlayerWeek
    {
        public int PlayerId { get; set; }
        public int Year { get; set; }
        public int Week { get; set; }
        public int PassYards { get; set; }
        public int PassTDs { get; set; }
        public int RushYards { get; set; }
        public int RushTDs { get; set; }
        public int RecYards { get; set; }
        public int RecTDs { get; set; }
        public int Interceptions { get; set; }
        public int FumblesLost { get; set; }
        public int TwoPointConvert { get; set; }
        public Guid? TeamId { get; set; }
        public bool Started { get; set; }
        public virtual Player Player { get; set; }
        public virtual Team Team { get; set; }
        [NotMapped]
        public double Points => CalculatePoints();

        public override string ToString()
        {
            return $"{PlayerId}.{Year}.{Week}";
        }
        public double CalculatePoints()
        {
            return PassYards / 25.0 + PassTDs * 4 + RushYards / 10.0 + RushTDs * 6 + RecYards / 10.0 + RecTDs * 6;
        }
    }
}
