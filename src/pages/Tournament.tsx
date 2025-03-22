
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tournament as TournamentType } from '../types/tournament';
import useTournament from '../hooks/useTournament';
import BracketView from '../components/BracketView';
import TournamentSetup from '../components/TournamentSetup';
import StatsPanel from '../components/StatsPanel';
import PlayerGoals from '../components/PlayerGoals';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Trophy, ChevronLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getTournamentProgress } from '../utils/tournamentUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const Tournament = () => {
  const navigate = useNavigate();
  const { 
    tournament, 
    loading, 
    createTournament, 
    updateMatchScore, 
    updateMatchTime,
    addPlayerGoal,
    setTournamentMVP 
  } = useTournament();
  
  const [activeTab, setActiveTab] = useState('bracket');
  
  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex flex-col space-y-8">
          <Skeleton className="h-12 w-64" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!tournament) {
    return <TournamentSetup onCreateTournament={createTournament} />;
  }
  
  const progress = getTournamentProgress(tournament);
  
  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">{tournament.name}</h1>
            <div className="flex items-center mt-2">
              <div className="text-sm text-muted-foreground mr-2">
                {tournament.teams.length} Teams
              </div>
              <div className="text-sm text-muted-foreground">
                {tournament.players.length} Players
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col items-end">
            <div className="flex space-x-2 mb-2">
              <PlayerGoals
                teams={tournament.teams}
                players={tournament.players}
                onAddGoal={addPlayerGoal}
                onSetMVP={setTournamentMVP}
              />
              
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Are you sure you want to reset the tournament? This will delete all matches.')) {
                    localStorage.removeItem('futsal-tournament');
                    window.location.reload();
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div className="w-64">
              <div className="flex justify-between text-xs mb-1">
                <div>Tournament Progress</div>
                <div>{progress}%</div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="bracket">Bracket</TabsTrigger>
            <TabsTrigger value="stats">
              <Trophy className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bracket" className="pt-4">
            <Card className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
              <BracketView
                tournament={tournament}
                onUpdateScore={updateMatchScore}
                onUpdateTime={updateMatchTime}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <StatsPanel
              tournament={tournament}
              onSetMVP={setTournamentMVP}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tournament;
