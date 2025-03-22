
import React from 'react';
import { Tournament, Player } from '../types/tournament';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Medal, Award, Trophy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsPanelProps {
  tournament: Tournament;
  onSetMVP: (playerId: string) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ tournament, onSetMVP }) => {
  // Get the top 5 scorers
  const topScorers = [...tournament.players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);
  
  // Find the MVP
  const mvp = tournament.players.find(p => p.isMVP);
  
  // Get team names for players
  const getTeamName = (teamId: string) => {
    const team = tournament.teams.find(t => t.id === teamId);
    return team?.name || 'Unknown Team';
  };
  
  // Determine if the tournament is complete
  const finalMatch = tournament.matches.find(
    m => m.round === tournament.totalRounds && !m.isThirdPlace
  );
  const tournamentComplete = finalMatch?.winnerId !== null;
  
  // Get the champion team if tournament is complete
  const championTeam = tournamentComplete && finalMatch?.winnerId
    ? tournament.teams.find(t => t.id === finalMatch.winnerId)
    : undefined;
  
  // Get the third place team
  const thirdPlaceMatch = tournament.matches.find(m => m.isThirdPlace);
  const thirdPlaceTeam = thirdPlaceMatch?.winnerId
    ? tournament.teams.find(t => t.id === thirdPlaceMatch.winnerId)
    : undefined;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {tournamentComplete && championTeam && (
        <Card className="overflow-hidden">
          <div className="h-20 bg-gradient-to-r from-futsal-600 to-futsal-400 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardContent className="pt-6 text-center">
            <h3 className="text-2xl font-bold">Champion</h3>
            <p className="text-xl mt-2">{championTeam.name}</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-4 w-4 mr-2 text-futsal-500" />
            Top Scorers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topScorers.map((player, index) => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 w-6 flex justify-center">
                    {index === 0 && <Medal className="h-5 w-5 text-yellow-500" />}
                    {index === 1 && <Medal className="h-5 w-5 text-gray-400" />}
                    {index === 2 && <Medal className="h-5 w-5 text-amber-700" />}
                    {index > 2 && <span className="text-sm text-muted-foreground">{index + 1}</span>}
                  </div>
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-xs text-muted-foreground">{getTeamName(player.teamId)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 font-mono font-medium text-lg">{player.goals}</div>
                </div>
              </div>
            ))}
            
            {topScorers.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No goals scored yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-4 w-4 mr-2 text-futsal-500" />
            Most Valuable Player
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mvp ? (
            <div className="flex items-center">
              <Avatar className="h-12 w-12 mr-4 border-2 border-futsal-500">
                <AvatarFallback className="bg-futsal-100 text-futsal-800">
                  {mvp.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-lg">{mvp.name}</div>
                <div className="text-sm text-muted-foreground">{getTeamName(mvp.teamId)}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              MVP not selected yet
            </div>
          )}
        </CardContent>
      </Card>
      
      {thirdPlaceTeam && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="h-4 w-4 mr-2 text-amber-700" />
              Third Place
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-2">
              <div className="font-medium text-lg">{thirdPlaceTeam.name}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsPanel;
