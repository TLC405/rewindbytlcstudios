import { Navbar } from '@/components/rewind/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Shield, Users, Zap, Eye } from 'lucide-react';
import { eraConfig, eraOrder, getFullPrompt } from '@/lib/decadePrompts';
import { useState } from 'react';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAuth();
  const [selectedEra, setSelectedEra] = useState(eraOrder[0]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-display text-gradient-gold mb-8 flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            TLC REWIND ADMIN
          </h1>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Users, label: 'Total Users', value: '1,234' },
              { icon: Zap, label: 'Generations Today', value: '567' },
              { icon: Eye, label: 'Active Sessions', value: '89' },
            ].map((stat) => (
              <div key={stat.label} className="card-premium p-6">
                <stat.icon className="w-8 h-8 text-primary mb-3" />
                <div className="text-3xl font-display text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-display text-chrome mb-4">ERA STATS</h2>
              <div className="space-y-2">
                {eraOrder.map(id => (
                  <div key={id} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <span className={`era-badge ${eraConfig[id].badgeClass}`}>
                      {eraConfig[id].icon} {eraConfig[id].name}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 500)} gens</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-display text-chrome mb-4">PROMPT INSPECTOR</h2>
              <select 
                value={selectedEra}
                onChange={(e) => setSelectedEra(e.target.value)}
                className="w-full mb-4 p-3 bg-input border border-border rounded-lg text-foreground"
              >
                {eraOrder.map(id => (
                  <option key={id} value={id}>{eraConfig[id].name}</option>
                ))}
              </select>
              <div className="terminal rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                <div className="terminal-header">FULL PROMPT</div>
                <pre className="p-4 text-xs text-green-400 whitespace-pre-wrap">
                  {getFullPrompt(selectedEra)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
