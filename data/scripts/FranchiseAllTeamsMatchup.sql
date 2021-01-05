DECLARE @year INT
--SET @year=2020

;WITH matchups (FranchiseName, Year, Week, Win, Loss, Tie, Points)
AS
(
	SELECT f.MainName,
		ts.Year,
		ts.Week,
		CASE WHEN ts.Points > os.Points THEN 1 ELSE 0 END AS Win,
		CASE WHEN ts.Points < os.Points THEN 1 ELSE 0 END AS Loss,
		CASE WHEN ts.Points = os.Points THEN 1 ELSE 0 END AS Tie,
		ts.Points
	FROM dbo.TeamScore ts
		INNER JOIN dbo.TeamScore os ON ts.Year = os.Year AND ts.Week = os.Week AND ts.TeamID != os.TeamID
		INNER JOIN dbo.Team t ON ts.TeamID=t.TeamID
		INNER JOIN dbo.Franchise f ON t.FranchiseID=f.FranchiseID
		INNER JOIN dbo.Team ot ON os.TeamID=ot.TeamID
		INNER JOIN dbo.Franchise oof ON ot.FranchiseID=oof.FranchiseID
	WHERE (@year IS NULL OR ts.Year = @year)
		AND ts.Week >= 15
)
SELECT m.FranchiseName,
	m.year,
	SUM(Win) AS Wins,
	SUM(Loss) AS Loses,
	SUM(Tie) AS Ties,
	(SUM(Win) + SUM(Tie) + SUM(Loss)) AS GamesPlayed,
	((2.0 * SUM(Win) + SUM(Tie)) / (2.0 * (SUM(Win) + SUM(Tie) + SUM(Loss))) * 100.0) AS WinPercent,
	SUM(Points)
FROM matchups m
GROUP BY FranchiseName, m.year
ORDER BY SUM(Win) DESC, SUM(Tie) DESC