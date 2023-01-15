export interface PlayoffPool {
  teams: PlayoffPoolTeam[];
  players: PlayoffPoolPlayer[];
}

export interface PlayoffPoolTeam {
  franchiseId: string;
  name: string;
  rank: number;
  points: number;
  gamesPlayed: number;
  playersRemaining: number;
}

export interface PlayoffPoolPlayer {
  playerId: number;
  name: string;
  franchiseId: string;
  games: PlayoffPoolPlayerGame[];
  points: number;
  gamesPlayed: number;
  eliminated: boolean;
  pick: number;
}

export interface PlayoffPoolPlayerGame {
  points: number;
  passYards: number;
  passTds: number;
  rushYards: number;
  rushTds: number;
  recYards: number;
  recTds: number;
  Interceptions: number;
  FumblesLost: number;
}