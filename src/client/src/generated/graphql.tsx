import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Guid: any;
};



export type Draft = {
  __typename?: 'Draft';
  date?: Maybe<Scalars['Date']>;
  draftId: Scalars['ID'];
  picks?: Maybe<Array<Maybe<DraftPick>>>;
  rounds: Scalars['Int'];
  snake: Scalars['Boolean'];
  year: Scalars['Int'];
};


export type DraftPicksArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  round?: Maybe<Scalars['Int']>;
  pick?: Maybe<Scalars['Int']>;
};

export type DraftPick = {
  __typename?: 'DraftPick';
  draftId: Scalars['ID'];
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  gamesPlayed?: Maybe<Scalars['Int']>;
  pick: Scalars['Int'];
  playerId: Scalars['Int'];
  playerName: Scalars['String'];
  playerPosition: Scalars['String'];
  playerPositionRank?: Maybe<Scalars['Int']>;
  playerPositionRankPpg?: Maybe<Scalars['Int']>;
  playerPrimaryPosition: Scalars['String'];
  points?: Maybe<Scalars['Float']>;
  positionPick: Scalars['Int'];
  round: Scalars['Int'];
  year: Scalars['Int'];
};

export type Franchise = {
  __typename?: 'Franchise';
  addCount?: Maybe<Scalars['Int']>;
  championships?: Maybe<Scalars['Int']>;
  dropCount?: Maybe<Scalars['Int']>;
  franchiseId: Scalars['ID'];
  loses?: Maybe<Scalars['Int']>;
  mainName: Scalars['String'];
  matches?: Maybe<Array<Maybe<Match>>>;
  picks?: Maybe<Array<Maybe<DraftPick>>>;
  points?: Maybe<Scalars['Float']>;
  runnerUps?: Maybe<Scalars['Int']>;
  teams?: Maybe<Array<Maybe<Team>>>;
  ties?: Maybe<Scalars['Int']>;
  tradeCount?: Maybe<Scalars['Int']>;
  trades?: Maybe<Array<Maybe<FranchiseTrade>>>;
  wins?: Maybe<Scalars['Int']>;
};


export type FranchiseMatchesArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  type?: Maybe<MatchType>;
  year?: Maybe<Scalars['Int']>;
  week?: Maybe<Scalars['Int']>;
};


export type FranchisePicksArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
  round?: Maybe<Scalars['Int']>;
  pick?: Maybe<Scalars['Int']>;
};


export type FranchiseTeamsArgs = {
  year?: Maybe<Scalars['Int']>;
};


export type FranchiseTradesArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type FranchiseTrade = {
  __typename?: 'FranchiseTrade';
  date: Scalars['DateTime'];
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  tradedaway?: Maybe<Array<Maybe<PlayerTransaction>>>;
  tradedfor?: Maybe<Array<Maybe<PlayerTransaction>>>;
  tradedWithFranchiseId: Scalars['ID'];
  tradedWithFranchiseName: Scalars['String'];
  tradeId: Scalars['ID'];
};

export type GibsonsLeagueQuery = {
  __typename?: 'GibsonsLeagueQuery';
  draft?: Maybe<Draft>;
  draftpicks?: Maybe<Array<Maybe<DraftPick>>>;
  franchise?: Maybe<Franchise>;
  franchises?: Maybe<Array<Maybe<Franchise>>>;
  league?: Maybe<League>;
  leagues?: Maybe<Array<Maybe<League>>>;
  matches?: Maybe<Array<Maybe<Match>>>;
  player?: Maybe<Player>;
  players?: Maybe<Array<Maybe<Player>>>;
  season?: Maybe<Season>;
  trade?: Maybe<FranchiseTrade>;
  trades?: Maybe<Array<Maybe<FranchiseTrade>>>;
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
};


export type GibsonsLeagueQueryDraftArgs = {
  year?: Maybe<Scalars['Int']>;
};


export type GibsonsLeagueQueryDraftpicksArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
  franchiseId?: Maybe<Scalars['Guid']>;
};


export type GibsonsLeagueQueryFranchiseArgs = {
  id?: Maybe<Scalars['Guid']>;
  name?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQueryLeagueArgs = {
  id?: Maybe<Scalars['Guid']>;
  name?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQueryMatchesArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  type?: Maybe<MatchType>;
  franchiseId?: Maybe<Scalars['Guid']>;
  year?: Maybe<Scalars['Int']>;
  week?: Maybe<Scalars['Int']>;
};


export type GibsonsLeagueQueryPlayerArgs = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQueryPlayersArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  query?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQuerySeasonArgs = {
  year?: Maybe<Scalars['Int']>;
  franchiseId?: Maybe<Scalars['Guid']>;
};


export type GibsonsLeagueQueryTradeArgs = {
  id?: Maybe<Scalars['Guid']>;
};


export type GibsonsLeagueQueryTradesArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  franchiseId?: Maybe<Scalars['Guid']>;
  year?: Maybe<Scalars['Int']>;
};


export type GibsonsLeagueQueryTransactionsArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  type?: Maybe<TransactionType>;
  year?: Maybe<Scalars['Int']>;
  franchiseId?: Maybe<Scalars['Guid']>;
};


export type League = {
  __typename?: 'League';
  draft?: Maybe<Draft>;
  drafts?: Maybe<Array<Maybe<Draft>>>;
  franchises?: Maybe<Array<Maybe<Franchise>>>;
  leagueId: Scalars['ID'];
  name: Scalars['String'];
  records?: Maybe<Array<Maybe<LeagueRecords>>>;
  startYear?: Maybe<Scalars['Int']>;
};


export type LeagueDraftArgs = {
  year: Scalars['Int'];
};


export type LeagueRecordsArgs = {
  number?: Scalars['Int'];
  positivity?: Maybe<Scalars['Boolean']>;
};

export type LeagueRecord = {
  __typename?: 'LeagueRecord';
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  rank: Scalars['Int'];
  recordNumericValue: Scalars['Float'];
  recordValue: Scalars['String'];
  week?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type LeagueRecords = {
  __typename?: 'LeagueRecords';
  positiveRecord: Scalars['Boolean'];
  recordTitle: Scalars['String'];
  top?: Maybe<Array<Maybe<LeagueRecord>>>;
  type?: Maybe<Scalars['String']>;
};

export type Match = {
  __typename?: 'Match';
  losingFranchise: Scalars['String'];
  losingFranchiseId: Scalars['ID'];
  losingFranchisePoints: Scalars['Float'];
  losingFranchiseProjectedPoints?: Maybe<Scalars['Float']>;
  tied: Scalars['Boolean'];
  type?: Maybe<Scalars['String']>;
  week: Scalars['Int'];
  winningFranchise: Scalars['String'];
  winningFranchiseId: Scalars['ID'];
  winningTeamPoints: Scalars['Float'];
  winningTeamProjectedPoints?: Maybe<Scalars['Float']>;
  year: Scalars['Int'];
};

export enum MatchType {
  Regular = 'REGULAR',
  Playoff = 'PLAYOFF',
  Consolation = 'CONSOLATION',
  Championship = 'CHAMPIONSHIP'
}

export type Player = {
  __typename?: 'Player';
  avgPositionRank?: Maybe<Scalars['Float']>;
  avgPositionRankPpg?: Maybe<Scalars['Float']>;
  gamesPlayed?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
  playerId: Scalars['Int'];
  points?: Maybe<Scalars['Float']>;
  pointsPerGame?: Maybe<Scalars['Float']>;
  pointsPerSeason?: Maybe<Scalars['Float']>;
  position: Scalars['String'];
  primaryPosition: Scalars['String'];
  seasons?: Maybe<Array<Maybe<PlayerSeason>>>;
  seasonsCount?: Maybe<Scalars['Int']>;
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
  yahooPlayerId?: Maybe<Scalars['Int']>;
};


export type PlayerSeasonsArgs = {
  year?: Maybe<Scalars['Int']>;
};


export type PlayerTransactionsArgs = {
  type?: Maybe<TransactionType>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type PlayerSeason = {
  __typename?: 'PlayerSeason';
  gamesPlayed: Scalars['Int'];
  name: Scalars['String'];
  playerId: Scalars['Int'];
  points: Scalars['Float'];
  position: Scalars['String'];
  positionRank: Scalars['Int'];
  positionRankPpg: Scalars['Int'];
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
  year: Scalars['Int'];
};


export type PlayerSeasonTransactionsArgs = {
  type?: Maybe<TransactionType>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type PlayerTransaction = {
  __typename?: 'PlayerTransaction';
  date: Scalars['DateTime'];
  description: Scalars['String'];
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  name: Scalars['String'];
  playerId: Scalars['Int'];
  position: Scalars['String'];
  positionRank?: Maybe<Scalars['Float']>;
  positionRankPpg?: Maybe<Scalars['Float']>;
  primaryPosition: Scalars['String'];
  related?: Maybe<Array<Maybe<PlayerTransaction>>>;
  seasonGamesPlayed?: Maybe<Scalars['Float']>;
  seasonPoints?: Maybe<Scalars['Float']>;
  transactionGroupId?: Maybe<Scalars['Guid']>;
  transactionId: Scalars['ID'];
  type?: Maybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type Season = {
  __typename?: 'Season';
  finished?: Maybe<Scalars['Boolean']>;
  teams?: Maybe<Array<Maybe<Team>>>;
  yahooGameId?: Maybe<Scalars['Int']>;
  year: Scalars['Int'];
};

export type Team = {
  __typename?: 'Team';
  champion: Scalars['Boolean'];
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  loses: Scalars['Int'];
  matches?: Maybe<Array<Maybe<Match>>>;
  name: Scalars['String'];
  points: Scalars['Float'];
  secondPlace: Scalars['Boolean'];
  standing: Scalars['Int'];
  ties: Scalars['Int'];
  wins: Scalars['Int'];
  year: Scalars['Int'];
};


export type TeamMatchesArgs = {
  type?: Maybe<MatchType>;
  week?: Maybe<Scalars['Int']>;
};

export enum TransactionType {
  DraftPicked = 'DRAFT_PICKED',
  Kept = 'KEPT',
  Added = 'ADDED',
  Dropped = 'DROPPED',
  Traded = 'TRADED',
  VetoedTrade = 'VETOED_TRADE'
}
