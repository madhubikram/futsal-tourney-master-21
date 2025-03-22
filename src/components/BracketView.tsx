
import React from 'react';
import { Match, Tournament } from '../types/tournament';
import MatchCard from './MatchCard';
import { cn } from '@/lib/utils';

interface BracketViewProps {
  tournament: Tournament;
  onUpdateScore: (matchId: string, score1: number, score2: number, penalties1?: number | null, penalties2?: number | null) => void;
  onUpdateTime: (matchId: string, date: Date) => void;
}

const BracketView: React.FC<BracketViewProps> = ({
  tournament,
  onUpdateScore,
  onUpdateTime
}) => {
  const { matches, totalRounds, currentRound } = tournament;
  
  // Group matches by round
  const matchesByRound: Match[][] = [];
  for (let i = 1; i <= totalRounds; i++) {
    const roundMatches = matches
      .filter(match => match.round === i && !match.isThirdPlace)
      .sort((a, b) => a.matchNumber - b.matchNumber);
    
    matchesByRound.push(roundMatches);
  }
  
  // Get third place match
  const thirdPlaceMatch = matches.find(match => match.isThirdPlace);
  
  const getTeamById = (teamId: string | null) => {
    if (!teamId) return undefined;
    return tournament.teams.find(team => team.id === teamId);
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex overflow-x-auto pb-8 space-x-8 bracket-container">
        {matchesByRound.map((roundMatches, roundIndex) => (
          <div 
            key={`round-${roundIndex + 1}`} 
            className={cn(
              "flex flex-col space-y-8 relative",
              roundIndex === 0 ? "justify-around" : "justify-center"
            )}
          >
            <div className="text-center mb-4 sticky top-0">
              <div className="text-sm font-medium text-muted-foreground">
                Round {roundIndex + 1}
              </div>
              <div className="font-semibold">
                {roundIndex === 0 && "First Round"}
                {roundIndex === totalRounds - 1 && "Final"}
                {roundIndex !== 0 && roundIndex !== totalRounds - 1 && 
                  (roundIndex === totalRounds - 2 ? "Semifinals" : `Round of ${Math.pow(2, totalRounds - roundIndex)}`)
                }
              </div>
            </div>
            
            <div className={cn(
              "flex flex-col",
              roundIndex === 0 ? "space-y-8" : "space-y-16",
              roundIndex === 1 ? "mt-8" : "",
              roundIndex === 2 ? "mt-24" : "",
              roundIndex === 3 ? "mt-56" : "",
              roundIndex === 4 ? "mt-112" : ""
            )}>
              {roundMatches.map((match) => (
                <div key={match.id} className="relative">
                  <MatchCard
                    match={match}
                    team1={getTeamById(match.team1Id)}
                    team2={getTeamById(match.team2Id)}
                    onUpdateScore={onUpdateScore}
                    onUpdateTime={onUpdateTime}
                    isPastMatch={match.round < currentRound}
                    isCurrentRound={match.round === currentRound}
                  />
                  
                  {/* Draw bracket lines */}
                  {roundIndex < totalRounds - 1 && (
                    <div className="absolute top-1/2 -right-8 w-8 h-px border-t border-slate-300 dark:border-slate-700 bracket-line" />
                  )}
                  
                  {roundIndex > 0 && (
                    <div className="absolute top-1/2 -left-8 w-8 h-px border-t border-slate-300 dark:border-slate-700 bracket-line" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Third place match */}
      {thirdPlaceMatch && (
        <div className="mt-12 border-t pt-8">
          <div className="flex justify-center">
            <div>
              <div className="text-center mb-4">
                <div className="font-semibold">Third Place Match</div>
              </div>
              <MatchCard
                match={thirdPlaceMatch}
                team1={getTeamById(thirdPlaceMatch.team1Id)}
                team2={getTeamById(thirdPlaceMatch.team2Id)}
                onUpdateScore={onUpdateScore}
                onUpdateTime={onUpdateTime}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BracketView;
