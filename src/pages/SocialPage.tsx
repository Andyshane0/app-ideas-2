import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, limit, where } from 'firebase/firestore';
import { SocialPost } from '../types';
import { Share2, Flame, MoreHorizontal, Zap } from 'lucide-react';
import { cn, formatRelativeTime } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function SocialPage() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState<'FEED' | 'RANKINGS'>('FEED');

  useEffect(() => {
    const path = 'posts';
    const q = query(
      collection(db, path),
      where('userId', '>=', ''),
      orderBy('userId'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Mock some data if nothing exists
        setPosts([
          {
            id: '1',
            userId: '1',
            userName: 'Jaxon.X',
            userArchetype: 'STOIC_WARRIOR',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaxon',
            content: 'Just crushed the "Deep Focus Protocol". No distractions, purely driven. The void provides clarity.',
            auraReacts: 24,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            achievement: { type: 'streak', title: '7-Day Deep Work Streak' }
          },
          {
            id: '2',
            userId: '2',
            userName: 'Elena.V',
            userArchetype: 'SCHOLAR',
            userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
            content: 'Rebuilding the system from the ground up. Day 1 of the "Synthesize" phase complete.',
            imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
            auraReacts: 89,
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ]);
      } else {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SocialPost)));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col gap-6">
        <h2 className="font-display text-4xl text-white font-bold tracking-tighter">The Arena</h2>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-white/5">
          {['FEED', 'RANKINGS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "flex-1 py-4 text-[10px] font-mono tracking-[0.2em] font-bold uppercase transition-all duration-300",
                activeTab === tab ? "text-primary border-b-2 border-primary" : "text-white/40 hover:text-white/60 border-b-2 border-transparent"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Posts List */}
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden">
                    <img src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(0,219,231,0.8)] border-2 border-surface" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display text-sm font-bold text-white leading-none">{post.userName}</h3>
                  <span className="text-[9px] font-mono text-primary uppercase tracking-widest mt-1 opacity-70">
                    {post.userArchetype.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono text-white/30 uppercase">
                {formatRelativeTime(new Date(post.timestamp))}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#b9cacb] leading-relaxed">
                {post.content}
              </p>
              
              {post.achievement && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                    <Flame className="w-5 h-5 text-secondary fill-secondary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-secondary uppercase tracking-widest">Achievement Unlocked</p>
                    <p className="font-display text-md font-bold text-white tracking-tight">{post.achievement.title}</p>
                  </div>
                </div>
              )}

              {post.imageUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                  <img src={post.imageUrl} className="w-full h-full object-cover opacity-80" alt="Post" />
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between border-t border-white/5 pt-4">
              <button className="flex items-center gap-2 group transition-colors">
                <Zap className="w-4 h-4 text-primary group-hover:text-primary group-hover:fill-primary/20" />
                <span className="text-[10px] font-mono text-primary uppercase tracking-widest leading-none">
                  Aura React ({post.auraReacts})
                </span>
              </button>
              <button className="text-white/20 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </footer>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
