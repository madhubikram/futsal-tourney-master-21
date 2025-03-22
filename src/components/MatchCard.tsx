import React, { useState } from 'react';
import { format } from 'date-fns';
import { Match, Team } from '../types/tournament';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, Trophy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MatchCardProps {
  match: Match;
  team1?: Team;
  team2?: Team;
  onUpdateScore: (matchId: string, score1: number, score2: number, penalties1?: number | null, penalties2?: number | null) => void;
  onUpdateTime: (matchId: string, date: Date) => void;
  isPastMatch?: boolean;
  isCurrentRound?: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  team1,
  team2,
  onUpdateScore,
  onUpdateTime,
  isPastMatch = false,
  isCurrentRound = false
}) => {
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [score1, setScore1] = useState<string>(match.score1?.toString() || '');
  const [score2, setScore2] = useState<string>(match.score2?.toString() || '');
  const [penalties1, setPenalties1] = useState<string>(match.penalties1?.toString() || '');
  const [penalties2, setPenalties2] = useState<string>(match.penalties2?.toString() || '');
  const [selectedDate, setSelectedDate] = useState<Date>(match.matchTime?.date || new Date());
  const [selectedHour, setSelectedHour] = useState<string>(
    match.matchTime?.date ? format(match.matchTime.date, 'HH') : '16'
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    match.matchTime?.date ? format(match.matchTime.date, 'mm') : '00'
  );
  
  const handleSubmitScore = () => {
    const newScore1 = parseInt(score1);
    const newScore2 = parseInt(score2);
    
    if (isNaN(newScore1) || isNaN(newScore2)) return;
    
    let newPenalties1 = penalties1 ? parseInt(penalties1) : null;
    let newPenalties2 = penalties2 ? parseInt(penalties2) : null;
    
    if (newScore1 === newScore2) {
      if (penalties1 && penalties2) {
        newPenalties1 = parseInt(penalties1);
        newPenalties2 = parseInt(penalties2);
      }
    } else {
      newPenalties1 = null;
      newPenalties2 = null;
    }
    
    onUpdateScore(match.id, newScore1, newScore2, newPenalties1, newPenalties2);
    setIsScoreDialogOpen(false);
  };
  
  const handleSubmitTime = () => {
    const date = new Date(selectedDate);
    date.setHours(parseInt(selectedHour));
    date.setMinutes(parseInt(selectedMinute));
    onUpdateTime(match.id, date);
  };
  
  const showPenalties = score1 === score2 && score1 !== '';
  
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  
  return (
    <div className={cn(
      "neo-blur rounded-xl p-4 shadow-lg w-64 transition-all duration-300",
      isPastMatch ? "opacity-75" : "opacity-100",
      isCurrentRound ? "ring-2 ring-futsal-500/50" : "",
      match.isBye ? "opacity-50" : ""
    )}>
      <div className="text-xs text-muted-foreground mb-2">
        {match.isThirdPlace ? "3rd Place Match" : `Round ${match.round} · Match ${match.matchNumber}`}
      </div>
      
      <div className="space-y-4">
        <MatchTeam
          team={team1}
          score={match.score1}
          penalties={match.penalties1}
          isWinner={match.winnerId === team1?.id}
        />
        
        <MatchTeam
          team={team2}
          score={match.score2}
          penalties={match.penalties2}
          isWinner={match.winnerId === team2?.id}
        />
      </div>
      
      {match.matchTime && (
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {format(match.matchTime.date, "MMM d, yyyy · HH:mm")}
          </span>
        </div>
      )}
      
      {!match.isBye && (team1 || team2) && (
        <div className="mt-4 flex justify-between space-x-2">
          <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="bg-futsal-950/50 hover:bg-futsal-900/50 text-futsal-50"
              >
                Set Score
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-futsal-500/20">
              <DialogHeader>
                <DialogTitle className="text-futsal-50">Update Match Score</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-futsal-50">
                    {team1?.name || "TBD"}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    className="w-16 text-center bg-slate-800 border-futsal-500/20 text-futsal-50"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium text-futsal-50">
                    {team2?.name || "TBD"}
                  </div>
                  <Input
                    type="number"
                    min="0"
                    className="w-16 text-center bg-slate-800 border-futsal-500/20 text-futsal-50"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                  />
                </div>
                
                {showPenalties && (
                  <>
                    <div className="text-center text-sm font-medium mt-4 mb-2 text-futsal-50">
                      Penalties
                    </div>
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-2">
                        <div className="text-sm text-futsal-100">{team1?.name}</div>
                        <Input
                          type="number"
                          min="0"
                          className="w-16 text-center bg-slate-800 border-futsal-500/20 text-futsal-50"
                          value={penalties1}
                          onChange={(e) => setPenalties1(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-futsal-100">{team2?.name}</div>
                        <Input
                          type="number"
                          min="0"
                          className="w-16 text-center bg-slate-800 border-futsal-500/20 text-futsal-50"
                          value={penalties2}
                          onChange={(e) => setPenalties2(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitScore}
                    className="bg-futsal-600 hover:bg-futsal-700 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">Set Time</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Match Time</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Select value={selectedHour} onValueChange={setSelectedHour}>
                        <SelectTrigger>
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {hours.map((hour) => (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex-1">
                      <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                        <SelectTrigger>
                          <SelectValue placeholder="Minute" />
                        </SelectTrigger>
                        <SelectContent>
                          {minutes.map((minute) => (
                            <SelectItem key={minute} value={minute}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSubmitTime}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

interface MatchTeamProps {
  team?: Team;
  score: number | null;
  penalties?: number | null;
  isWinner?: boolean;
}

const MatchTeam: React.FC<MatchTeamProps> = ({
  team,
  score,
  penalties,
  isWinner
}) => {
  if (!team) {
    return (
      <div className="flex items-center justify-between py-2">
        <div className="text-muted-foreground">TBD</div>
        <div className="text-muted-foreground">-</div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center justify-between py-2 border-l-2 pl-2 transition-colors",
      isWinner ? "border-futsal-500" : "border-transparent"
    )}>
      <div className="flex items-center">
        {team.logo ? (
          <img src={team.logo} alt={team.name} className="w-6 h-6 mr-2 object-contain" />
        ) : (
          <div className="w-6 h-6 bg-muted rounded-full mr-2" />
        )}
        <div className={cn(
          "font-medium",
          isWinner ? "text-foreground" : "text-muted-foreground"
        )}>
          {team.name}
          {isWinner && <Trophy className="inline-block ml-1 h-3 w-3 text-futsal-500" />}
        </div>
      </div>
      <div className="font-mono">
        {score !== null ? score : "-"}
        {penalties !== null && score !== null && (
          <span className="text-xs text-muted-foreground ml-1">({penalties})</span>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
