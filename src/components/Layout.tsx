import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LayoutDashboard, CheckSquare, MessageSquare, Users, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { profile, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CheckSquare, label: 'Missions', path: '/missions' },
    { icon: MessageSquare, label: 'AI Chat', path: '/chat' },
    { icon: Users, label: 'Social', path: '/social' },
    { icon: Bell, label: 'Alerts', path: '/transmissions' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col pb-24 md:pb-0 md:pl-20">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel z-40 px-5 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-primary/30 overflow-hidden">
            <img 
              src={profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter text-primary">ALTER</span>
        </div>
        <button 
          onClick={logout}
          className="p-2 rounded-full hover:bg-white/5 transition-colors text-primary/60"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar Navigation (Desktop) */}
      <nav className="fixed left-0 top-16 bottom-0 w-20 hidden md:flex flex-col items-center py-8 glass-panel border-r border-primary/10 z-30">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "p-4 rounded-xl transition-all duration-300 relative group mb-4",
                isActive ? "text-primary bg-primary/10" : "text-white/40 hover:text-primary"
              )}
            >
              <item.icon className="w-6 h-6" />
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-l-full shadow-[0_0_8px_rgba(0,219,231,0.8)]"
                />
              )}
              <div className="absolute left-full ml-4 px-2 py-1 rounded bg-surface-container-high text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-primary/20">
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-5 max-w-4xl mx-auto w-full flex-grow">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-1/2 left-0 right-0 bottom-0 h-20 glass-panel z-50 flex justify-around items-center px-2 border-t border-primary/10">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-300",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(0,219,231,0.6)] scale-110" : "text-white/40"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] uppercase font-mono mt-1 tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
