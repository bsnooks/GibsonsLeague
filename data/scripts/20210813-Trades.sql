BEGIN TRAN
DECLARE @groupId UNIQUEIDENTIFIER = NEWID()
DECLARE @date DATETIME = GETDATE()
DECLARE @year int = 2021
DECLARE @toTeamId UNIQUEIDENTIFIER = '76C19CD9-4462-4B1B-9E5C-02DA1E2D88BC'
DECLARE @fromTeamId UNIQUEIDENTIFIER = '155AAA08-2B30-4306-9948-3A7F4D3F1A1A'

INSERT INTO [dbo].[TransactionGroup] (TransactionGroupID, Date) VALUES (@groupId, @date)
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @toTeamId, 5, 26686, @year, @date, 'Balero Boyz traded Travis Kelce to leaf16 for Keenan Allen, George Kittle')


INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @fromTeamId, 5, 26699, @year, @date, 'leaf16 traded Keenan Allen with George Kittle to Balero Boyz for Travis Kelce')
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @fromTeamId, 5, 30259, @year, @date, 'leaf16 traded George Kittle with Keenan Allen to Balero Boyz for Travis Kelce')

SET @groupId = NEWID()
SET @fromTeamId = '03FEA09B-930C-4C09-A1C6-763F9008FED2'

INSERT INTO [dbo].[TransactionGroup] (TransactionGroupID, Date) VALUES (@groupId, @date)
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @fromTeamId, 5, 30977, @year, @date, 'leaf16 traded Josh Allen to The Mojos for Calvin Ridley, Derrick Henry, Jalen Hurts, Aaron Rodgers')


INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @toTeamId, 5, 30996, @year, @date, 'The Mojos traded Calvin Ridley with Derrick Henry, Jalen Hurts, Aaron Rodgers to leaf16 for Josh Allen')
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @toTeamId, 5, 29279, @year, @date, 'The Mojos traded Derrick Henry with Calvin Ridley, Jalen Hurts, Aaron Rodgers to leaf16 for Josh Allen')
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @toTeamId, 5, 32723, @year, @date, 'The Mojos traded Jalen Hurts with Calvin Ridley, Derrick Henry, Aaron Rodgers to leaf16 for Josh Allen')
INSERT INTO [dbo].[Transaction] (TransactionGroupID, TeamID, TransactionType, PlayerID, Year, Date, Description)
VALUES (@groupId, @toTeamId, 5, 7200, @year, @date, 'The Mojos traded Aaron Rodgers with Calvin Ridley, Derrick Henry, Jalen Hurts to leaf16 for Josh Allen')

COMMIT TRAN








