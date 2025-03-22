
import React, { useState } from 'react';
import { Tournament as TournamentType } from '../types/tournament';
import useTournament from '../hooks/useTournament';
import BracketView from '../components/BracketView';
import TournamentSetup from '../components/TournamentSetup';
import StatsPanel from '../components/StatsPanel';
import PlayerGoals from '../components/PlayerGoals';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { getTournamentProgress } from '../utils/tournamentUtils';

const Tournament = () => {
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
      <div className="min-h-screen bg-background p-8 max-w-6xl mx-auto">
        <div className="flex flex-col space-y-8">
          <Skeleton className="h-12 w-64 bg-slate-800" />
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-24 bg-slate-800" />
            <Skeleton className="h-10 w-24 bg-slate-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full bg-slate-800" />
            <Skeleton className="h-64 w-full bg-slate-800" />
            <Skeleton className="h-64 w-full bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!tournament) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-4xl p-6">
          <TournamentSetup onCreateTournament={createTournament} />
        </div>
      </div>
    );
  }
  
  const progress = getTournamentProgress(tournament);
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-futsal-500 to-futsal-300">
              {tournament.name}
            </h1>
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
                className="border-futsal-700 hover:border-futsal-500 hover:bg-slate-800"
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
              <Progress value={progress} className="h-2 bg-slate-800" />
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-800 border border-slate-700">
            <TabsTrigger 
              value="bracket" 
              className="data-[state=active]:bg-futsal-900 data-[state=active]:text-white"
            >
              Bracket
            </TabsTrigger>
            <TabsTrigger 
              value="stats"
              className="data-[state=active]:bg-futsal-900 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bracket" className="pt-4">
            <Card className="p-4 tournament-card">
              <BracketView
                tournament={tournament}
                onUpdateScore={updateMatchScore}
                onUpdateTime={updateMatchTime}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="stats">
            <Card className="p-4 tournament-card">
              <StatsPanel
                tournament={tournament}
                onSetMVP={setTournamentMVP}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tournament;
