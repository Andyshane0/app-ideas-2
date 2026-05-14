import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Zap, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ARCHETYPES } from '../constants';
import { getFutureSelfResponse } from '../lib/gemini';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, where } from 'firebase/firestore';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function ChatPage() {
  const { user, profile } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const archetype = ARCHETYPES.find(a => a.id === profile?.archetype) || ARCHETYPES[0];

  useEffect(() => {
    if (!user) return;
    const path = `users/${user.uid}/chat`;
    const q = query(
      collection(db, path),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !user || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    const path = `users/${user.uid}/chat`;
    try {
      // Save user message to Firestore
      await addDoc(collection(db, path), {
        userId: user.uid,
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
        mode: profile?.archetype
      });

      // Prepare history for Gemini
      const history = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: msg.content }]
      }));

      // Get AI response
      const response = await getFutureSelfResponse(archetype.systemPrompt, history, userMessage);

      // Save AI response to Firestore
      await addDoc(collection(db, path), {
        userId: user.uid,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        mode: profile?.archetype
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] glitch-bg relative rounded-2xl overflow-hidden border border-primary/10">
      {/* Mode Indicator */}
      <div className="flex justify-center p-4 sticky top-0 z-10 bg-black/40 backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(225,253,255,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono text-primary uppercase tracking-widest leading-none">
            {archetype.name} Mode Active
          </span>
        </div>
      </div>

      {/* Chat History */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto px-5 py-8 flex flex-col gap-6"
      >
        <AnimatePresence>
          {messages.length === 0 && !isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 opacity-30 text-sm font-mono uppercase tracking-widest"
            >
              Secure Link Established. Awaiting Input.
            </motion.div>
          )}
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex flex-col gap-1 max-w-[85%]",
                msg.role === 'user' ? "self-end items-end" : "self-start items-start"
              )}
            >
              <span className="text-[10px] font-mono text-white/30 px-2 uppercase tracking-widest">
                {msg.role === 'user' ? 'YOU' : 'FUTURE SELF'}
              </span>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed glass-panel",
                msg.role === 'user' ? "rounded-tr-sm border-white/10" : "rounded-tl-sm border-primary/20 neon-border-primary"
              )}>
                {msg.content}
              </div>
              <span className="text-[10px] font-mono text-white/20 px-2 uppercase mt-1">
                {format(new Date(msg.timestamp), 'HH:mm')}
              </span>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start flex flex-col gap-1 items-start"
            >
              <span className="text-[10px] font-mono text-white/30 px-2 uppercase tracking-widest">FUTURE SELF</span>
              <div className="p-4 rounded-2xl rounded-tl-sm glass-panel border-primary/20 animate-pulse">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <div className="p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex items-center gap-3 glass-panel p-2 pl-6 rounded-full border border-primary/30 focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(0,219,231,0.2)] transition-all duration-300">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Speak to your future..."
            className="flex-grow bg-transparent border-none outline-none text-white placeholder:text-white/20 text-sm focus:ring-0"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              "p-3 rounded-full bg-primary/10 text-primary border border-primary/30 transition-all",
              "hover:bg-primary/20 active:scale-95 disabled:opacity-30 disabled:grayscale"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
