
;WITH timesKept (PlayerID, Position, Times)
AS
(
	SELECT p.PlayerID,
		p.Position,
		COUNT(TransactionID) TimesDrafted
	FROM [transaction] t
		INNER JOIN player p ON t.PlayerID=p.PlayerID
		INNER JOIN team ON t.TeamID=team.TeamID
		INNER JOIN franchise f ON team.FranchiseID=f.FranchiseID
	WHERE TransactionType=2
	GROUP BY p.PlayerID, p.Position
)
SELECT Position, ROUND(AVG(CAST(Times AS FLOAT)), 2)
FROM timesKept
GROUP BY Position