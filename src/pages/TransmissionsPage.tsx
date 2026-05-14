import { motion } from 'motion/react';
import { Bell, AlertTriangle, ShieldAlert, Zap, User, Clock, Info, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function TransmissionsPage() {
  const transmissions = [
    {
      id: '1',
      priority: 'CRITICAL',
      title: 'Discipline or regret. Choose.',
      content: 'Your metrics indicate a deviation from optimal pathing. Rectify immediately.',
      timestamp: 'T-MINUS 00:00',
      icon: AlertTriangle,
      color: 'text-error',
      border: 'border-error/30',
      glow: 'shadow-[0_0_15px_rgba(255,180,171,0.2)]'
    },
    {
      id: '2',
      priority: 'ELEVATED',
      title: 'Future You is waiting.',
      content: 'Current trajectory suboptimal. Recalibration required to meet end-of-cycle objectives.',
      timestamp: '08:42:11 UTC',
      icon: Zap,
      color: 'text-tertiary-container',
      border: 'border-tertiary-container/30',
      glow: 'shadow-[0_0_15px_rgba(189,236,0,0.2)]'
    },
    {
      id: '3',
      priority: 'DEGRADED',
      title: 'Your future self lost respect today.',
      content: 'Mission parameters failed. Log inputs to understand points of friction.',
      timestamp: 'YESTERDAY',
      icon: ShieldAlert,
      color: 'text-secondary',
      border: 'border-secondary/30',
      glow: 'shadow-[0_0_15px_rgba(255,172,232,0.2)]'
    },
    {
      id: '4',
      priority: 'STANDARD',
      title: 'System sync complete.',
      content: 'Neural baseline established. Awaiting next command input.',
      timestamp: 'CYCLE 44',
      icon: ShieldCheck,
      color: 'text-white/40',
      border: 'border-white/10',
      glow: ''
    }
  ];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="flex flex-col gap-2">
        <h2 className="font-display text-4xl text-white font-bold tracking-tighter uppercase">Transmissions</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,219,231,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono text-primary tracking-widest uppercase">Secure AI Uplink Active</span>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        {transmissions.map((log) => (
          <motion.article 
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "relative glass-panel rounded-2xl p-6 overflow-hidden border-l-2",
              log.border
            )}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <log.icon className={cn("w-4 h-4", log.color)} />
                <span className={cn("text-[9px] font-mono px-2 py-0.5 rounded-sm bg-white/5 border uppercase tracking-widest", log.border, log.color)}>
                  Priority: {log.priority}
                </span>
              </div>
              <span className="text-[9px] font-mono text-white/30 uppercase">{log.timestamp}</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">{log.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed font-sans">{log.content}</p>
            </div>
            
            {/* Visual Flair */}
            <div className={cn("absolute inset-0 bg-gradient-to-r from-transparent to-black pointer-events-none opacity-20")} />
          </motion.article>
        ))}
      </div>

      <div className="flex justify-center items-center py-10 opacity-30 gap-6 mt-6">
        <div className="h-px w-16 bg-white/10" />
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]">End of Log</span>
        <div className="h-px w-16 bg-white/10" />
      </div>
    </div>
  );
}
