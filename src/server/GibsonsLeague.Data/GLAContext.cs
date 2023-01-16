using System;
using GibsonsLeague.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace GibsonsLeague.Data
{
    public partial class GLAContext : DbContext
    {
        public GLAContext()
        {
        }

        public GLAContext(DbContextOptions<GLAContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Draft> Drafts { get; set; }
        public virtual DbSet<DraftPick> DraftPicks { get; set; }
        public virtual DbSet<Franchise> Franchises { get; set; }
        public virtual DbSet<League> Leagues { get; set; }
        public virtual DbSet<Match> Matches { get; set; }
        public virtual DbSet<Owner> Owners { get; set; }
        public virtual DbSet<Player> Players { get; set; }
        public virtual DbSet<PlayerSeason> PlayerSeasons { get; set; }
        public virtual DbSet<PlayerWeek> PlayerWeeks{ get; set; }
        public virtual DbSet<Season> Seasons { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<TeamScore> TeamScores { get; set; }
        public virtual DbSet<Transaction> Transactions { get; set; }
        public virtual DbSet<TransactionGroup> TransactionGroups { get; set; }
        public virtual DbSet<PlayoffPoolPlayer> PlayoffPoolPlayers { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Draft>(entity =>
            {
                entity.ToTable("Draft");

                entity.Property(e => e.DraftId)
                    .HasColumnName("DraftID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.HasOne(d => d.League)
                    .WithMany(p => p.Drafts)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Draft_League");

                entity.HasOne(d => d.Season)
                    .WithMany(p => p.Drafts)
                    .HasForeignKey(d => new { d.LeagueId, d.Year })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Draft_Season");
            });

            modelBuilder.Entity<DraftPick>(entity =>
            {
                entity.ToTable("DraftPick");

                entity.Property(e => e.DraftPickId)
                    .HasColumnName("DraftPickID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.DraftId).HasColumnName("DraftID");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

                entity.Property(e => e.PositionPick).HasDefaultValueSql("((1))");

                entity.Property(e => e.TeamId).HasColumnName("TeamID");

                entity.HasOne(d => d.Draft)
                    .WithMany(p => p.DraftPicks)
                    .HasForeignKey(d => d.DraftId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DraftPick_Draft");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.DraftPicks)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DraftPick_Player");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.DraftPicks)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DraftPick_Team");
            });

            modelBuilder.Entity<Franchise>(entity =>
            {
                entity.ToTable("Franchise");

                entity.Property(e => e.FranchiseId)
                    .HasColumnName("FranchiseID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.Property(e => e.MainName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.League)
                    .WithMany(p => p.Franchises)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Franchise_League");
            });

            modelBuilder.Entity<League>(entity =>
            {
                entity.ToTable("League");

                entity.Property(e => e.LeagueId)
                    .HasColumnName("LeagueID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.HostId).HasColumnName("HostID");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Match>(entity =>
            {
                entity.ToTable("Match");

                entity.Property(e => e.MatchId)
                    .HasColumnName("MatchID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.Property(e => e.LosingTeamId).HasColumnName("LosingTeamID");

                entity.Property(e => e.MatchTypeId)
                    .HasColumnName("MatchTypeID")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.WinningTeamId).HasColumnName("WinningTeamID");

                entity.HasOne(d => d.League)
                    .WithMany(p => p.Matches)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Match_League");

                entity.HasOne(d => d.LosingTeam)
                    .WithMany(p => p.MatchLosingTeams)
                    .HasForeignKey(d => d.LosingTeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Match_LosingTeam");

                entity.HasOne(d => d.WinningTeam)
                    .WithMany(p => p.MatchWinningTeams)
                    .HasForeignKey(d => d.WinningTeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Match_WinningTeam");

                entity.HasOne(d => d.Season)
                    .WithMany(p => p.Matches)
                    .HasForeignKey(d => new { d.LeagueId, d.Year })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Match_Season");
            });

            modelBuilder.Entity<Owner>(entity =>
            {
                entity.ToTable("Owner");

                entity.Property(e => e.OwnerId)
                    .HasColumnName("OwnerID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.FranchiceId).HasColumnName("FranchiceID");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.HasOne(d => d.Franchice)
                    .WithMany(p => p.Owners)
                    .HasForeignKey(d => d.FranchiceId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Owner_Franchise");
            });

            modelBuilder.Entity<Player>(entity =>
            {
                entity.ToTable("Player");

                entity.Property(e => e.PlayerId)
                    .ValueGeneratedNever()
                    .HasColumnName("PlayerID");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.Position).HasMaxLength(10);

                entity.Property(e => e.PrimaryPosition).HasMaxLength(2);

                entity.Property(e => e.ShortName).HasMaxLength(100);

                entity.Property(e => e.YahooPlayerId).HasColumnName("YahooPlayerID");
            });

            modelBuilder.Entity<PlayerSeason>(entity =>
            {
                entity.HasKey(e => new { e.PlayerId, e.Year });

                entity.ToTable("PlayerSeason");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.PlayerSeasons)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlayerSeason_Player");

                entity.HasOne(d => d.EndTeam)
                    .WithMany(p => p.PlayerSeasons)
                    .HasForeignKey(d => d.EndTeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlayerSeason_Team");
            });

            modelBuilder.Entity<PlayerWeek>(entity =>
            {
                entity.HasKey(e => new { e.PlayerId, e.Year, e.Week });

                entity.ToTable("PlayerWeek");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.PlayerWeeks)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlayerWeek_Player");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.PlayerWeeks)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlayerWeek_Team");
            });

            modelBuilder.Entity<Season>(entity =>
            {
                entity.HasKey(e => new { e.LeagueId, e.Year });

                entity.ToTable("Season");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.Property(e => e.Finished)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.YahooGameId).HasColumnName("YahooGameID");

                entity.Property(e => e.YahooLeagueId).HasColumnName("YahooLeagueID");

                entity.HasOne(d => d.League)
                    .WithMany(p => p.Seasons)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Season_League");
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.ToTable("Team");

                entity.Property(e => e.TeamId)
                    .HasColumnName("TeamID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.FranchiseId).HasColumnName("FranchiseID");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.OwnerId).HasColumnName("OwnerID");

                entity.Property(e => e.YahooTeamId).HasColumnName("YahooTeamID");

                entity.HasOne(d => d.Franchise)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.FranchiseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Team_Franchise");

                entity.HasOne(d => d.League)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Team_League");

                entity.HasOne(d => d.Owner)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => d.OwnerId)
                    .HasConstraintName("FK_Team_Owner");

                entity.HasOne(d => d.Season)
                    .WithMany(p => p.Teams)
                    .HasForeignKey(d => new { d.LeagueId, d.Year })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Team_Season");
            });

            modelBuilder.Entity<TeamScore>(entity =>
            {
                entity.HasKey(e => new { e.TeamId, e.Year, e.Week });

                entity.ToTable("TeamScore");

                entity.Property(e => e.TeamId).HasColumnName("TeamID");

                entity.Property(e => e.LeagueId).HasColumnName("LeagueID");

                entity.HasOne(d => d.League)
                    .WithMany(p => p.TeamScores)
                    .HasForeignKey(d => d.LeagueId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TeamScore_League");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.TeamScores)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TeamScore_Team");

                entity.HasOne(d => d.Season)
                    .WithMany(p => p.TeamScores)
                    .HasForeignKey(d => new { d.LeagueId, d.Year })
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TeamScore_Season");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.ToTable("Transaction");

                entity.Property(e => e.TransactionId)
                    .HasColumnName("TransactionID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(255);

                entity.Property(e => e.DraftPickId).HasColumnName("DraftPickID");

                entity.Property(e => e.PlayerId).HasColumnName("PlayerID");

                entity.Property(e => e.TeamId).HasColumnName("TeamID");

                entity.Property(e => e.TransactionGroupId).HasColumnName("TransactionGroupID");

                entity.Property(e => e.TransactionType).HasDefaultValueSql("((1))");

                entity.HasOne(d => d.DraftPick)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.DraftPickId)
                    .HasConstraintName("FK_Transaction_DraftPick");

                entity.HasOne(d => d.Player)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.PlayerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Transaction_Player");

                entity.HasOne(d => d.Team)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.TeamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Transaction_Team");

                entity.HasOne(d => d.TransactionGroup)
                    .WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.TransactionGroupId)
                    .HasConstraintName("FK_Transaction_TransactionGroup");
            });

            modelBuilder.Entity<TransactionGroup>(entity =>
            {
                entity.ToTable("TransactionGroup");

                entity.Property(e => e.TransactionGroupId)
                    .ValueGeneratedNever()
                    .HasColumnName("TransactionGroupID");

                entity.Property(e => e.Date)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
            });

            modelBuilder.Entity<PlayoffPoolPlayer>(entity =>
            {
                entity.ToTable("PlayoffPoolPlayer");

                entity.Property(e => e.PlayerId)
                    .ValueGeneratedNever();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
