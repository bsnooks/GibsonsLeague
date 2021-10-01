# Gibsons League Fantasy Archive
[![Server](https://github.com/bsnooks/GibsonsLeague/actions/workflows/server.yml/badge.svg)](https://github.com/bsnooks/GibsonsLeague/actions/workflows/server.yml)
[![Client](https://github.com/bsnooks/GibsonsLeague/actions/workflows/client.yml/badge.svg)](https://github.com/bsnooks/GibsonsLeague/actions/workflows/client.yml)

Archive of the Gibsons League fantasy football franchises since the leagues inception in 2002. Includes all time team records as well as the transaction history for all players.

[Live Site](https://gibsonsleague.com) - Note uses auto paused DB that takes several seconds to spin up.
## Technologies Used
- .NET Core 3.1
- Azure SQL Server
- Entity Framework Core
- GraphQL
- Apollo Client
- Docker

## Project Setup

### Tools
*ConsoleDataDownloader* console apps are hacked together tools to extract and import data from the original source of the data (primarily the [Yahoo Fantasy Sports API](https://developer.yahoo.com/fantasysports/guide/))

### Data
Raw files that were previously downloaded using the *ConsoleDataDownloader*.  Stored in the repo in the event yahoo changes their hosting approach.
As of 2021-09-30 support for updating a seasons data directly from yahoo was added.
