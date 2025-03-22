
import { Match, Team, Tournament, Player } from "../types/tournament";

// Generate initial matches for a tournament
export function generateInitialMatches(teams: Team[]): Match[] {
  const totalTeams = teams.length;
  let rounds = Math.ceil(Math.log2(totalTeams));
  const totalMatches = Math.pow(2, rounds) - 1;
  const matches: Match[] = [];
  
  // Calculate number of teams in first round
  const firstRoundTeams = totalTeams;
  const firstRoundMatches = Math.ceil(firstRoundTeams / 2);
  const byes = Math.pow(2, rounds) - totalTeams;
  
  // Generate all matches with empty data
  for (let i = 0; i < totalMatches; i++) {
    const round = Math.floor(Math.log2(i + 1)) + 1;
    const matchNumber = i + 1 - Math.pow(2, round - 1) + 1;
    
    matches.push({
      id: `match-${i + 1}`,
      round,
      matchNumber,
      team1Id: null,
      team2Id: null,
      score1: null,
      score2: null,
      winnerId: null,
      loserId: null,
      nextMatchId: round < rounds ? `match-${Math.floor((i + 1) / 2) + Math.pow(2, round - 1)}` : null,
      isBye: false
    });
  }
  
  // Add third place match
  matches.push({
    id: `match-${totalMatches + 1}`,
    round: rounds,
    matchNumber: 2,
    team1Id: null,
    team2Id: null,
    score1: null,
    score2: null,
    winnerId: null,
    loserId: null,
    nextMatchId: null,
    isThirdPlace: true
  });
  
  // Assign teams to first round
  let teamIndex = 0;
  for (let i = 0; i < firstRoundMatches; i++) {
    const matchIndex = Math.pow(2, rounds - 1) - 1 + i;
    
    // Assign first team
    if (teamIndex < teams.length) {
      matches[matchIndex].team1Id = teams[teamIndex].id;
      teamIndex++;
    }
    
    // Assign second team or mark as bye
    if (teamIndex < teams.length) {
      matches[matchIndex].team2Id = teams[teamIndex].id;
      teamIndex++;
    } else if (matches[matchIndex].team1Id) {
      // This is a bye match
      matches[matchIndex].isBye = true;
      matches[matchIndex].winnerId = matches[matchIndex].team1Id;
      
      // Propagate the winner to the next match
      if (matches[matchIndex].nextMatchId) {
        const nextMatchIndex = matches.findIndex(m => m.id === matches[matchIndex].nextMatchId);
        if (nextMatchIndex !== -1) {
          if (matches[nextMatchIndex].team1Id === null) {
            matches[nextMatchIndex].team1Id = matches[matchIndex].team1Id;
          } else {
            matches[nextMatchIndex].team2Id = matches[matchIndex].team1Id;
          }
        }
      }
    }
  }
  
  return matches;
}

// Update a match with new scores
export function updateMatch(
  tournament: Tournament,
  matchId: string,
  score1: number,
  score2: number,
  penalties1?: number | null,
  penalties2?: number | null
): Tournament {
  const matches = [...tournament.matches];
  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  if (matchIndex === -1) return tournament;
  
  const match = matches[matchIndex];
  
  // Update scores
  match.score1 = score1;
  match.score2 = score2;
  match.penalties1 = penalties1 ?? null;
  match.penalties2 = penalties2 ?? null;
  
  // Determine winner and loser
  let winnerId: string | null = null;
  let loserId: string | null = null;
  
  if (score1 > score2) {
    winnerId = match.team1Id;
    loserId = match.team2Id;
  } else if (score2 > score1) {
    winnerId = match.team2Id;
    loserId = match.team1Id;
  } else if (score1 === score2 && penalties1 !== null && penalties2 !== null) {
    // Penalties
    if (penalties1 > penalties2) {
      winnerId = match.team1Id;
      loserId = match.team2Id;
    } else if (penalties2 > penalties1) {
      winnerId = match.team2Id;
      loserId = match.team1Id;
    }
  }
  
  match.winnerId = winnerId;
  match.loserId = loserId;
  
  // If we have a winner, update the next match
  if (winnerId && match.nextMatchId) {
    const nextMatchIndex = matches.findIndex(m => m.id === match.nextMatchId);
    if (nextMatchIndex !== -1) {
      const nextMatch = matches[nextMatchIndex];
      
      // Determine if winner goes to team1 or team2 slot
      const isEvenMatchNumber = match.matchNumber % 2 === 0;
      if (isEvenMatchNumber) {
        nextMatch.team2Id = winnerId;
      } else {
        nextMatch.team1Id = winnerId;
      }
    }
  }
  
  // Handle third place match - find the losers of the semifinal matches
  const isSemiFinal = match.round === tournament.totalRounds - 1;
  if (isSemiFinal && loserId) {
    const thirdPlaceMatch = matches.find(m => m.isThirdPlace);
    if (thirdPlaceMatch) {
      if (thirdPlaceMatch.team1Id === null) {
        thirdPlaceMatch.team1Id = loserId;
      } else {
        thirdPlaceMatch.team2Id = loserId;
      }
    }
  }
  
  return {
    ...tournament,
    matches
  };
}

// Set match time
export function setMatchTime(
  tournament: Tournament,
  matchId: string,
  date: Date
): Tournament {
  const matches = [...tournament.matches];
  const matchIndex = matches.findIndex(m => m.id === matchId);
  
  if (matchIndex === -1) return tournament;
  
  matches[matchIndex] = {
    ...matches[matchIndex],
    matchTime: {
      date,
      durationMinutes: 60 // Default to 60 minutes
    }
  };
  
  return {
    ...tournament,
    matches
  };
}

// Add a goal for a player
export function addGoal(tournament: Tournament, playerId: string): Tournament {
  const players = [...tournament.players];
  const playerIndex = players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) return tournament;
  
  players[playerIndex] = {
    ...players[playerIndex],
    goals: players[playerIndex].goals + 1
  };
  
  return {
    ...tournament,
    players
  };
}

// Set MVP
export function setMVP(tournament: Tournament, playerId: string): Tournament {
  const players = tournament.players.map(p => ({
    ...p,
    isMVP: p.id === playerId
  }));
  
  return {
    ...tournament,
    players
  };
}

// Get top scorer
export function getTopScorers(tournament: Tournament): Player[] {
  return [...tournament.players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);
}

// Ensure time is divisible by 5 minutes
export function roundTimeToNearestFiveMinutes(date: Date): Date {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 5) * 5;
  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

// Get tournament progress percentage
export function getTournamentProgress(tournament: Tournament): number {
  const totalMatches = tournament.matches.length;
  const completedMatches = tournament.matches.filter(m => m.winnerId !== null).length;
  return Math.round((completedMatches / totalMatches) * 100);
}
