import * as React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import SelectionPage from './pages/SelectionPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import MissionsPage from './pages/MissionsPage';
import SocialPage from './pages/SocialPage';
import TransmissionsPage from './pages/TransmissionsPage';
import { motion } from 'motion/react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (!profile?.archetype && location.pathname !== '/selection') {
    return <Navigate to="/selection" replace />;
  }

  return <>{children}</>;
}

function LoginPage() {
  const { login, user } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  if (user) return <Navigate to={from} replace />;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8 relative overflow-hidden glitch-bg">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 relative z-10"
      >
        <div className="flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-7xl font-bold text-primary tracking-tighter mb-2"
          >
            ALTER
          </motion.h1>
          <p className="text-xs font-mono text-primary/40 uppercase tracking-[0.5em]">Identity Recalibration</p>
        </div>

        <div className="max-w-xs text-center">
          <p className="text-sm text-[#b9cacb]/60 leading-relaxed">
            Forge your elite future self. Break the cycles. Enter the void.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={login}
          className="group relative flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">Initiate Uplink</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/selection" element={<ProtectedRoute><SelectionPage /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Protected Layout Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Layout><ChatPage /></Layout></ProtectedRoute>} />
      <Route path="/missions" element={<ProtectedRoute><Layout><MissionsPage /></Layout></ProtectedRoute>} />
      <Route path="/social" element={<ProtectedRoute><Layout><SocialPage /></Layout></ProtectedRoute>} />
      <Route path="/transmissions" element={<ProtectedRoute><Layout><TransmissionsPage /></Layout></ProtectedRoute>} />
    </Routes>
  );
}
