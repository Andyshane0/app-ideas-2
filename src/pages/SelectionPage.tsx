import { useState } from 'react';
import { motion } from 'motion/react';
import { ARCHETYPES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import * as Icons from 'lucide-react';

export default function SelectionPage() {
  const { updateArchetype } = useAuth();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleStart = async () => {
    if (selectedId) {
      await updateArchetype(selectedId as any);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center px-5 pt-16 pb-32">
      <header className="mb-12 text-center max-w-md">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl text-primary font-bold tracking-tighter mb-4"
        >
          THE RITE
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-[#b9cacb] leading-relaxed"
        >
          Select your operational archetype. This determines your baseline protocols and objective hierarchy.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl flex-grow">
        {ARCHETYPES.map((archetype, index) => {
          const Icon = (Icons as any)[archetype.icon.charAt(0).toUpperCase() + archetype.icon.slice(1)] || Icons.Sword;
          const isActive = selectedId === archetype.id;

          return (
            <motion.button
              key={archetype.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedId(archetype.id)}
              className={cn(
                "w-full text-left glass-panel rounded-xl p-5 relative overflow-hidden group transition-all duration-300",
                isActive ? "neon-border-primary-active border-primary/80" : "neon-border-primary hover:border-primary/40"
              )}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 grayscale group-hover:opacity-20 transition-opacity"
                style={{ backgroundImage: `url(${archetype.image})` }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-2 rounded-lg bg-primary/10 border border-primary/20",
                    isActive && "bg-primary/20 border-primary"
                  )}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    isActive ? "bg-primary shadow-[0_0_8px_rgba(225,253,255,0.8)]" : "bg-primary/30"
                  )} />
                </div>
                <h2 className="font-display text-xl text-primary font-semibold mb-1">{archetype.name}</h2>
                <p className="text-sm text-[#b9cacb] leading-tight">{archetype.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black via-black/80 to-transparent z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={!selectedId}
          className={cn(
            "w-full bg-primary-container text-[#00363a] font-mono text-xs font-bold uppercase py-4 rounded-full tracking-widest transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]",
            !selectedId && "opacity-50 grayscale cursor-not-allowed"
          )}
        >
          Initiate Evolution
        </motion.button>
      </div>
    </div>
  );
}
