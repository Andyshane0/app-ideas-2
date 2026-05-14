import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Flame, Star, Zap, TrendingUp, Brain, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { ARCHETYPES } from '../constants';

export default function DashboardPage() {
  const { profile } = useAuth();
  const archetype = ARCHETYPES.find(a => a.id === profile?.archetype);

  if (!profile) return null;

  const stats = [
    { label: 'DISCIPLINE', value: profile.disciplineScore, icon: Brain, color: 'text-primary' },
    { label: 'CONSISTENCY', value: `${profile.consistencyScore}%`, icon: TrendingUp, color: 'text-secondary' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Stats */}
      <section className="grid grid-cols-3 gap-1 glass-panel rounded-xl p-4 border-primary/10">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40">LEVEL</span>
          <span className="font-display text-2xl text-primary font-bold">{profile.level}</span>
        </div>
        <div className="flex flex-col items-center border-x border-white/5">
          <span className="text-[10px] font-mono text-white/40">AURA</span>
          <span className="font-display text-2xl text-tertiary-container font-bold neon-text-tertiary">{profile.aura}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40">STREAK</span>
          <span className="font-display text-2xl text-white font-bold flex items-center gap-1">
            {profile.streak} <Flame className="w-4 h-4 text-secondary fill-secondary" />
          </span>
        </div>
      </section>

      {/* Evolution Core */}
      <section className="flex flex-col items-center gap-6 py-4">
        <h2 className="text-xs font-mono text-primary tracking-[0.3em] uppercase">Evolution Core</h2>
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Progress Circle (Simplified SVG) */}
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1c1c1c" strokeWidth="2" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="url(#progressGradient)" 
              strokeWidth="4" 
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * profile.xp / 1000) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bdec00" />
                <stop offset="100%" stopColor="#00f2ff" />
              </linearGradient>
            </defs>
          </svg>

          {/* Avatar Container */}
          <div className="w-48 h-48 rounded-full glass-panel overflow-hidden border border-primary/20 flex items-center justify-center relative">
            <img 
              src={archetype?.image || profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} 
              className="w-full h-full object-cover opacity-60 mix-blend-screen grayscale filter contrast-125"
              alt="Avatar"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
        </div>

        <div className="text-center w-full max-w-xs">
          <div className="h-1 w-full bg-[#1c1c1c] rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(profile.xp / 1000) * 100}%` }}
              className="h-full bg-gradient-to-r from-tertiary-container to-primary shadow-[0_0_8px_rgba(0,219,231,0.8)]"
            />
          </div>
          <p className="text-[10px] font-mono text-white/40 mt-3 tracking-widest uppercase">
            {1000 - profile.xp} XP TO NEXT LEVEL
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-12 h-12" />
            </div>
            <div className="flex flex-col gap-1 relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={cn("text-2xl font-display font-bold", stat.color)}>{stat.value}</span>
                {typeof stat.value === 'number' && <span className="text-[10px] font-mono text-white/40">/100</span>}
              </div>
              <div className="mt-2 text-[10px] text-primary/40 font-mono">
                {stat.label === 'DISCIPLINE' ? 'EXCELLENT' : 'PEAK'}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
