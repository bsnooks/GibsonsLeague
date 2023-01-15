export interface PlayoffPool {
  teams: PlayoffPoolTeam[];
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
  games: PlayoffPoolPlayerGame[];
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