import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { Mission } from '../types';
import { Check, Lock, Zap, Clock, Droplets, Snowflake, Brain, Coffee } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const MISSION_ICONS: Record<string, any> = {
  'water': Droplets,
  'cold_shower': Snowflake,
  'focus': Brain,
  'morning': Coffee,
  'streak': Zap,
};

export default function MissionsPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);

  useEffect(() => {
    if (!user) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    const path = `users/${user.uid}/missions`;
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      where('date', '==', today)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Create initial missions if none exist for today
        const initialMissions: Omit<Mission, 'id'>[] = [
          { userId: user.uid, title: 'Morning Hydration', description: 'Drink 1L of water with electrolytes.', xpReward: 50, completed: false, date: today, icon: 'water' },
          { userId: user.uid, title: 'Cold Shower', description: 'Maintain exposure for 3 minutes.', xpReward: 150, completed: false, date: today, icon: 'cold_shower' },
          { userId: user.uid, title: 'Deep Work Session', description: '90 minutes of unchecked focus block.', xpReward: 300, completed: false, date: today, icon: 'focus' },
          { userId: user.uid, title: 'Evening Reflection', description: 'Journal 3 core insights.', xpReward: 100, completed: false, date: today, icon: 'morning', locked: true, unlockTime: '20:00' },
        ];

        initialMissions.forEach(m => {
          const newDoc = doc(collection(db, path));
          setDoc(newDoc, m).catch(e => handleFirestoreError(e, OperationType.CREATE, path));
        });
      } else {
        setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mission)));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleMission = async (mission: Mission) => {
    if (mission.locked || !user) return;
    const path = `users/${user.uid}/missions/${mission.id}`;
    const docRef = doc(db, path);
    try {
      await updateDoc(docRef, { completed: !mission.completed, completedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const completedCount = missions.filter(m => m.completed).length;
  const progressPercent = missions.length > 0 ? (completedCount / missions.length) * 100 : 0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="flex flex-col gap-2">
        <h2 className="font-display text-4xl text-white font-bold tracking-tighter">Mission Control</h2>
        <p className="text-sm text-white/40 leading-relaxed">
          Execute your daily protocols to maintain optimal performance state. Complete missions to earn XP.
        </p>
      </section>

      {/* Progress Bar Container */}
      <section className="glass-panel rounded-2xl p-6 border-tertiary-container/20 relative overflow-hidden">
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <span className="text-[10px] font-mono text-tertiary-container uppercase tracking-widest">Daily Goal</span>
            <div className="font-display text-xl text-white mt-1">{completedCount}/{missions.length} Missions</div>
          </div>
          <span className="text-[10px] font-mono text-[#b9cacb] uppercase tracking-widest">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden relative z-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-primary-container to-tertiary-container shadow-[0_0_8px_rgba(189,236,0,0.6)]"
          />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary-container/5 rounded-full blur-3xl" />
      </section>

      {/* Missions List */}
      <section className="flex flex-col gap-4">
        {missions.sort((a, b) => (a.locked ? 1 : 0) - (b.locked ? 1 : 0)).map((mission) => {
          const Icon = MISSION_ICONS[mission.icon] || Check;
          
          return (
            <motion.div
              key={mission.id}
              whileTap={!mission.locked ? { scale: 0.98 } : {}}
              onClick={() => toggleMission(mission)}
              className={cn(
                "glass-panel rounded-2xl p-5 border border-white/5 relative overflow-hidden transition-all group",
                mission.completed ? "opacity-50" : "hover:border-tertiary-container/40",
                mission.locked && "opacity-40 grayscale pointer-events-none"
              )}
            >
              {!mission.locked && !mission.completed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container/80 shadow-[0_0_8px_rgba(189,236,0,0.4)]" />
              )}
              
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
                    mission.completed ? "bg-tertiary-container text-black border-tertiary-container" : "bg-white/5 border-white/10 text-white/40",
                    mission.locked && "border-white/5"
                  )}>
                    {mission.locked ? <Lock className="w-4 h-4" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex flex-col">
                    <h3 className={cn(
                      "font-display text-md font-semibold",
                      mission.completed ? "line-through text-white/40" : "text-white"
                    )}>
                      {mission.title}
                    </h3>
                    <p className="text-xs text-white/40">{mission.description}</p>
                    {mission.locked && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-tertiary-container font-mono tracking-widest uppercase">
                        <Clock className="w-3 h-3" /> Unlocks at {mission.unlockTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10",
                    mission.completed ? "text-white/20" : "text-tertiary-container border-tertiary-container/20 bg-tertiary-container/5"
                  )}>
                    +{mission.xpReward} XP
                  </span>
                  <div className={cn(
                    "px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-widest font-bold transition-all",
                    mission.completed ? "bg-white/5 text-white/20 border border-white/5" : "bg-tertiary-container text-black shadow-[0_0_15px_rgba(189,236,0,0.2)]",
                    mission.locked ? "bg-black/40 text-white/10 border border-white/5" : "hover:scale-105"
                  )}>
                    {mission.completed ? 'DONE' : mission.locked ? 'LOCKED' : 'COMPLETE'}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
