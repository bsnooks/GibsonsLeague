DECLARE @teamID UNIQUEIDENTIFIER
DECLARE @franchiseName NVARCHAR(MAX)

SET @franchiseName='The Mojos'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Josh Allen',
		'Dalvin Cook',
		'Davante Adams',
		'Justin Jefferson',
		'Darren Waller'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='Gagnon'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Alvin Kamara',
		'DeAndre Hopkins',
		'Matthew Stafford',
		'A.J. Brown',
		'Nick Chubb'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='leaf16'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Travis Kelce',
		'Calvin Ridley',
		'Derrick Henry',
		'Aaron Rodgers',
		'Jalen Hurts'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='Balero Boyz'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Keenan Allen',
		'George Kittle',
		'Tom Brady',
		'Chris Carson',
		'Jalen Hurts'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='She''s the Fastest'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Kyler Murray',
		'DK Metcalf',
		'Jonathan Taylor',
		'Antonio Gibson',
		'Chris Godwin'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='The Bad Guys'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Lamar Jackson',
		'Christian McCaffrey',
		'Mike Evans',
		'Mark Andrews',
		'Baker Mayfield'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='Steel Curtain'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
--INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Tyreek Hill',
		'Joe Burrow',
		'Saquon Barkley',
		'Chase Claypool',
		'Odell Beckham Jr.'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

SET @franchiseName='FB in the Groin'
SELECT @teamID = TeamID FROM Team INNER JOIN Franchise ON Team.FranchiseID=Franchise.FranchiseID WHERE MainName=@franchiseName AND [Year]=2021
INSERT INTO [dbo].[Transaction] (TeamID, TransactionType, PlayerID, [Date], [Description])
SELECT @teamID, 2, PlayerID, '2021-08-31', 'Kept by ' + @franchiseName
FROM player
WHERE [Name] IN (
		'Russell Wilson',
		'Ezekiel Elliott',
		'Terry McLaurin',
		'Ryan Tannehill',
		'Deshaun Watson'
	)
	AND PrimaryPosition IN ('QB', 'WR', 'RB', 'TE')

