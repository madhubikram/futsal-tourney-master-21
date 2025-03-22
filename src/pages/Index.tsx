
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Calendar, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-futsal-500 mr-2" />
            <span className="font-bold text-xl">Futsal Tourney Master</span>
          </div>
          <nav>
            <Link to="/tournament">
              <Button>Launch App</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-futsal-700 to-futsal-500">
                Create Your Ultimate Futsal Tournament
              </h1>
              <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-slate-600 dark:text-slate-300">
                Effortlessly manage your futsal tournaments with our elegant bracket system. 
                Track scores, manage schedules, and crown your champions with style.
              </p>
              <Link to="/tournament">
                <Button size="lg" className="px-8 py-6 text-lg rounded-full">
                  Start Tournament
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Calendar className="h-8 w-8 text-futsal-500" />}
                title="Match Scheduling"
                description="Schedule matches with 5-minute interval precision. Keep your tournament organized with proper timing."
              />
              
              <FeatureCard 
                icon={<Target className="h-8 w-8 text-futsal-500" />}
                title="Penalty Shootouts"
                description="Handle tie-breakers with built-in penalty shootout tracking to determine the true winner."
              />
              
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-futsal-500" />}
                title="Player Stats"
                description="Track top scorers and MVP players. Recognize excellence with detailed statistics."
              />
            </div>
          </div>
        </section>
        
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your Tournament?</h2>
            <p className="text-lg mb-8 text-slate-600 dark:text-slate-300">
              Set up your bracket in minutes with our intuitive interface.
            </p>
            <Link to="/tournament">
              <Button size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-5 w-5 text-futsal-400 mr-2" />
            <span className="font-bold">Futsal Tourney Master</span>
          </div>
          <p className="text-slate-400 text-sm">
            Create beautiful tournaments with ease
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="transition-all hover:shadow-md animate-scale-in">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default Index;
