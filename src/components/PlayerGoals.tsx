
import React, { useState } from 'react';
import { Team, Player } from '../types/tournament';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerGoalsProps {
  teams: Team[];
  players: Player[];
  onAddGoal: (playerId: string) => void;
  onSetMVP: (playerId: string) => void;
}

const PlayerGoals: React.FC<PlayerGoalsProps> = ({
  teams,
  players,
  onAddGoal,
  onSetMVP
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    teams.length > 0 ? teams[0].id : null
  );
  
  // Group players by team
  const playersByTeam = players.reduce<Record<string, Player[]>>((acc, player) => {
    if (!acc[player.teamId]) {
      acc[player.teamId] = [];
    }
    acc[player.teamId].push(player);
    return acc;
  }, {});
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Goals & MVP</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Player Goals & MVP</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Tabs defaultValue={teams[0]?.id} onValueChange={setSelectedTeamId}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 mb-4">
              {teams.map(team => (
                <TabsTrigger key={team.id} value={team.id} className="text-xs sm:text-sm">
                  {team.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {teams.map(team => (
              <TabsContent key={team.id} value={team.id}>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {playersByTeam[team.id]?.map(player => (
                      <div key={player.id} className="flex items-center justify-between p-3 rounded-md border bg-card">
                        <div className="flex items-center">
                          <div className="mr-3">
                            {player.isMVP && (
                              <div className="p-1 rounded-full bg-futsal-100 text-futsal-800">
                                <Award className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {player.goals} {player.goals === 1 ? 'goal' : 'goals'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSetMVP(player.id)}
                          >
                            MVP
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onAddGoal(player.id)}
                          >
                            + Goal
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {(!playersByTeam[team.id] || playersByTeam[team.id].length === 0) && (
                      <div className="text-center py-4 text-muted-foreground">
                        No players for this team
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerGoals;
