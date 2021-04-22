CREATE TABLE #table (PlayerID int, Year INT, NewPositionRank INT)
DECLARE @year INT

INSERT INTO #table
SELECT playerSeason.PlayerID,
	PlayerSeason.Year,
	ROW_NUMBER() OVER (PARTITION BY PlayerSeason.Year, Player.PrimaryPosition ORDER BY (Points/GamesPlayed) DESC) AS NewPositionRank
FROM dbo.PlayerSeason
	INNER JOIN dbo.Player ON Player.PlayerID=PlayerSeason.PlayerID
WHERE (@year IS NULL OR Year=@year) AND GamesPlayed > 2

UPDATE dbo.PlayerSeason
SET PositionRankPpg=t.NewPositionRank
FROM dbo.PlayerSeason
	INNER JOIN #table t ON t.PlayerID=PlayerSeason.PlayerID AND t.Year=PlayerSeason.Year

DELETE FROM #table

INSERT INTO #table
SELECT playerSeason.PlayerID,
	PlayerSeason.Year,
	ROW_NUMBER() OVER (PARTITION BY PlayerSeason.Year, Player.PrimaryPosition ORDER BY (Points) DESC) AS NewPositionRank
FROM dbo.PlayerSeason
	INNER JOIN dbo.Player ON Player.PlayerID=PlayerSeason.PlayerID
WHERE (@year IS NULL OR Year=@year)

UPDATE dbo.PlayerSeason
SET PositionRank=t.NewPositionRank
FROM dbo.PlayerSeason
	INNER JOIN #table t ON t.PlayerID=PlayerSeason.PlayerID AND t.Year=PlayerSeason.Year

DROP TABLE #table