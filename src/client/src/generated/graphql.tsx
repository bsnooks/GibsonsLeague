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
  franchiseId: Scalars['ID'];
  mainName: Scalars['String'];
  picks?: Maybe<Array<Maybe<DraftPick>>>;
  transactions?: Maybe<Array<Maybe<PlayerTransaction>>>;
};


export type FranchisePicksArgs = {
  year?: Maybe<Scalars['Int']>;
  round?: Maybe<Scalars['Int']>;
  pick?: Maybe<Scalars['Int']>;
};


export type FranchiseTransactionsArgs = {
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
  startYear?: Maybe<Scalars['Int']>;
};


export type LeagueDraftArgs = {
  year: Scalars['Int'];
};

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

export enum TransactionType {
  DraftPicked = 'DRAFT_PICKED',
  Kept = 'KEPT',
  Added = 'ADDED',
  Dropped = 'DROPPED',
  Traded = 'TRADED',
  VetoedTrade = 'VETOED_TRADE'
}
