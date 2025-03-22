
export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  goals: number;
  isMVP?: boolean;
}

export interface MatchTime {
  date: Date;
  durationMinutes: number;
}

export interface Match {
  id: string;
  round: number;
  matchNumber: number;
  team1Id: string | null;
  team2Id: string | null;
  score1: number | null;
  score2: number | null;
  penalties1?: number | null;
  penalties2?: number | null;
  matchTime?: MatchTime;
  winnerId: string | null;
  loserId: string | null;
  nextMatchId: string | null;
  isBye?: boolean;
  isThirdPlace?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  teams: Team[];
  matches: Match[];
  players: Player[];
  currentRound: number;
  totalRounds: number;
}
