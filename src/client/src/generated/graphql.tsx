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
  pick: Scalars['Int'];
  playerName: Scalars['String'];
  round: Scalars['Int'];
  year: Scalars['Int'];
};

export type Franchise = {
  __typename?: 'Franchise';
  adds?: Maybe<Scalars['Int']>;
  championships?: Maybe<Scalars['Int']>;
  drops?: Maybe<Scalars['Int']>;
  franchiseId: Scalars['ID'];
  loses?: Maybe<Scalars['Int']>;
  mainName: Scalars['String'];
  matches?: Maybe<Array<Maybe<Match>>>;
  picks?: Maybe<Array<Maybe<DraftPick>>>;
  points?: Maybe<Scalars['Float']>;
  runnerUps?: Maybe<Scalars['Int']>;
  teams?: Maybe<Array<Maybe<Team>>>;
  ties?: Maybe<Scalars['Int']>;
  trades?: Maybe<Scalars['Int']>;
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
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


export type FranchiseTransactionsArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  type?: Maybe<TransactionType>;
  year?: Maybe<Scalars['Int']>;
};

export type GibsonsLeagueQuery = {
  __typename?: 'GibsonsLeagueQuery';
  franchise?: Maybe<Franchise>;
  franchises?: Maybe<Array<Maybe<Franchise>>>;
  league?: Maybe<League>;
  leagues?: Maybe<Array<Maybe<League>>>;
  player?: Maybe<Player>;
};


export type GibsonsLeagueQueryFranchiseArgs = {
  id?: Maybe<Scalars['Guid']>;
  name?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQueryLeagueArgs = {
  id?: Maybe<Scalars['Guid']>;
  name?: Maybe<Scalars['String']>;
};


export type GibsonsLeagueQueryPlayerArgs = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
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
};

export type LeagueRecord = {
  __typename?: 'LeagueRecord';
  franchiseId: Scalars['ID'];
  franchiseName: Scalars['String'];
  rank: Scalars['Int'];
  recordValue: Scalars['String'];
  week?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
};

export type LeagueRecords = {
  __typename?: 'LeagueRecords';
  recordTitle: Scalars['String'];
  top?: Maybe<Array<Maybe<LeagueRecord>>>;
};

export type Match = {
  __typename?: 'Match';
  losingFranchise: Scalars['String'];
  tied: Scalars['Boolean'];
  type?: Maybe<Scalars['String']>;
  week: Scalars['Int'];
  winningFranchise: Scalars['String'];
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
  name: Scalars['String'];
  playerId: Scalars['Int'];
  position: Scalars['String'];
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
  yahooPlayerId?: Maybe<Scalars['Int']>;
};


export type PlayerTransactionsArgs = {
  type?: Maybe<TransactionType>;
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
};

export type PlayerTransaction = {
  __typename?: 'PlayerTransaction';
  date: Scalars['DateTime'];
  description: Scalars['String'];
  franchiseName: Scalars['String'];
  name: Scalars['String'];
  playerId: Scalars['Int'];
  related?: Maybe<Array<Maybe<PlayerTransaction>>>;
  type?: Maybe<Scalars['String']>;
};

export type Team = {
  __typename?: 'Team';
  champion: Scalars['Boolean'];
  franchiseName: Scalars['String'];
  loses: Scalars['Int'];
  matches?: Maybe<Array<Maybe<Match>>>;
  name: Scalars['String'];
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
