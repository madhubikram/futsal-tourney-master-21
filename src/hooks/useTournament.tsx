
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Team, Tournament, Player, Match } from '../types/tournament';
import { generateInitialMatches, updateMatch, setMatchTime, addGoal, setMVP, roundTimeToNearestFiveMinutes } from '../utils/tournamentUtils';

const LOCAL_STORAGE_KEY = 'futsal-tournament';

const useTournament = () => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  // Load tournament from local storage
  useEffect(() => {
    const savedTournament = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTournament) {
      const parsed = JSON.parse(savedTournament);
      
      // Convert string dates back to Date objects
      const matches = parsed.matches.map((match: any) => {
        if (match.matchTime && match.matchTime.date) {
          return {
            ...match,
            matchTime: {
              ...match.matchTime,
              date: new Date(match.matchTime.date)
            }
          };
        }
        return match;
      });
      
      setTournament({
        ...parsed,
        matches
      });
    }
    setLoading(false);
  }, []);

  // Save tournament to local storage whenever it changes
  useEffect(() => {
    if (tournament) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tournament));
    }
  }, [tournament]);

  // Create a new tournament
  const createTournament = (name: string, teams: Team[], players: Player[]) => {
    const rounds = Math.ceil(Math.log2(teams.length));
    const matches = generateInitialMatches(teams);
    
    const newTournament: Tournament = {
      id: uuidv4(),
      name,
      teams,
      matches,
      players,
      currentRound: 1,
      totalRounds: rounds
    };
    
    setTournament(newTournament);
    return newTournament;
  };

  // Update a match score
  const updateMatchScore = (
    matchId: string, 
    score1: number, 
    score2: number, 
    penalties1?: number | null, 
    penalties2?: number | null
  ) => {
    if (!tournament) return;
    const updatedTournament = updateMatch(
      tournament, 
      matchId, 
      score1, 
      score2, 
      penalties1, 
      penalties2
    );
    setTournament(updatedTournament);
  };

  // Set match time
  const updateMatchTime = (matchId: string, date: Date) => {
    if (!tournament) return;
    const roundedDate = roundTimeToNearestFiveMinutes(date);
    const updatedTournament = setMatchTime(tournament, matchId, roundedDate);
    setTournament(updatedTournament);
  };

  // Add a goal for a player
  const addPlayerGoal = (playerId: string) => {
    if (!tournament) return;
    const updatedTournament = addGoal(tournament, playerId);
    setTournament(updatedTournament);
  };

  // Set tournament MVP
  const setTournamentMVP = (playerId: string) => {
    if (!tournament) return;
    const updatedTournament = setMVP(tournament, playerId);
    setTournament(updatedTournament);
  };

  // Add a team
  const addTeam = (name: string, logo?: string) => {
    if (!tournament) return;
    const newTeam: Team = {
      id: uuidv4(),
      name,
      logo
    };
    
    setTournament({
      ...tournament,
      teams: [...tournament.teams, newTeam]
    });
    
    return newTeam;
  };

  // Add a player
  const addPlayer = (name: string, teamId: string) => {
    if (!tournament) return;
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      teamId,
      goals: 0
    };
    
    setTournament({
      ...tournament,
      players: [...tournament.players, newPlayer]
    });
    
    return newPlayer;
  };

  // Get matches by round
  const getMatchesByRound = (round: number): Match[] => {
    if (!tournament) return [];
    return tournament.matches.filter(match => match.round === round);
  };

  // Get team by ID
  const getTeamById = (teamId: string | null): Team | undefined => {
    if (!teamId || !tournament) return undefined;
    return tournament.teams.find(team => team.id === teamId);
  };

  // Get player by ID
  const getPlayerById = (playerId: string): Player | undefined => {
    if (!tournament) return undefined;
    return tournament.players.find(player => player.id === playerId);
  };

  // Get players by team ID
  const getPlayersByTeamId = (teamId: string): Player[] => {
    if (!tournament) return [];
    return tournament.players.filter(player => player.teamId === teamId);
  };

  return {
    tournament,
    loading,
    createTournament,
    updateMatchScore,
    updateMatchTime,
    addPlayerGoal,
    setTournamentMVP,
    addTeam,
    addPlayer,
    getMatchesByRound,
    getTeamById,
    getPlayerById,
    getPlayersByTeamId
  };
};

export default useTournament;
