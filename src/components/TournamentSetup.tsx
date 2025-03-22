
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Team, Player } from '../types/tournament';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, Users, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TournamentSetupProps {
  onCreateTournament: (name: string, teams: Team[], players: Player[]) => void;
}

const TournamentSetup: React.FC<TournamentSetupProps> = ({ onCreateTournament }) => {
  const [tournamentName, setTournamentName] = useState('Futsal Tournament');
  const [teams, setTeams] = useState<Team[]>([
    { id: uuidv4(), name: 'Team 1' },
    { id: uuidv4(), name: 'Team 2' }
  ]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  const addTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam: Team = {
      id: uuidv4(),
      name: newTeamName
    };
    setTeams([...teams, newTeam]);
    setNewTeamName('');
  };
  
  const removeTeam = (teamId: string) => {
    setTeams(teams.filter(team => team.id !== teamId));
    setPlayers(players.filter(player => player.teamId !== teamId));
  };
  
  const addPlayer = () => {
    if (!newPlayerName.trim() || !selectedTeamId) return;
    const newPlayer: Player = {
      id: uuidv4(),
      name: newPlayerName,
      teamId: selectedTeamId,
      goals: 0
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
  };
  
  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };
  
  const handleCreateTournament = () => {
    if (teams.length < 2) return;
    onCreateTournament(tournamentName, teams, players);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Futsal Tournament</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Tournament Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tournamentName">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Teams
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={addTeam}>Add Team</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {teams.map(team => (
              <div key={team.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900">
                <div>{team.name}</div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-muted-foreground">
                    {players.filter(p => p.teamId === team.id).length} players
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
            
            {teams.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No teams added yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Players
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Player</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="playerName">Player Name</Label>
                  <Input
                    id="playerName"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="playerTeam">Team</Label>
                  <select
                    id="playerTeam"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedTeamId || ''}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                  >
                    <option value="">Select a team</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={addPlayer}>Add Player</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {teams.map(team => (
                <div key={team.id}>
                  <h3 className="font-medium text-sm my-2">{team.name}</h3>
                  <div className="space-y-1 pl-4 mb-4">
                    {players.filter(p => p.teamId === team.id).map(player => (
                      <div key={player.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900">
                        <div>{player.name}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                    
                    {players.filter(p => p.teamId === team.id).length === 0 && (
                      <div className="text-sm text-muted-foreground py-1">
                        No players added for this team
                      </div>
                    )}
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
              
              {teams.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Add teams first
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-8">
        <Button 
          size="lg" 
          onClick={handleCreateTournament}
          disabled={teams.length < 2}
        >
          Create Tournament
        </Button>
      </div>
    </div>
  );
};

export default TournamentSetup;
