
SELECT f.MainName, t.Name, ts.Points, ts.Year, ts.Week
FROM dbo.TeamScore ts
	INNER JOIN dbo.Team t ON ts.TeamID=t.TeamID
	INNER JOIN dbo.Franchise f ON t.FranchiseID=f.FranchiseID
ORDER BY Points DESC

SELECT f.MainName, AVG(points) AS AveragePoints, COUNT(ts.Points)
FROM dbo.TeamScore ts
	INNER JOIN dbo.Team t ON ts.TeamID=t.TeamID
	INNER JOIN dbo.Franchise f ON t.FranchiseID=f.FranchiseID
WHERE ts.Week >= 15
GROUP BY f.MainName
ORDER BY AVG(points) DESC

SELECT f.MainName, AVG(points) AS AveragePoints, COUNT(ts.Points) AS Games
FROM dbo.TeamScore ts
	INNER JOIN dbo.Team t ON ts.TeamID=t.TeamID
	INNER JOIN dbo.Franchise f ON t.FranchiseID=f.FranchiseID
WHERE ts.Year >= 2018 AND ts.Week < 15
GROUP BY f.MainName
ORDER BY AVG(points) DESC