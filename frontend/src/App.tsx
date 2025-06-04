import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useBCI } from './hooks/useBCI';

// Services
import { initializeAnalytics } from './services/analytics';

function App() {
  const { isLoading: isAuthLoading, user } = useAuth();
  const { isConnected: isBCIConnected } = useBCI();

  useEffect(() => {
    // Initialize analytics
    initializeAnalytics();

    // Set up global error handling
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // In production, you might want to send this to an error tracking service
    });

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', () => {});
    };
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-slate-100">
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#fbbf24_1px,_transparent_2px),radial-gradient(circle_at_80%_20%,_#f59e0b_1px,_transparent_2px),radial-gradient(circle_at_60%_80%,_#fbbf24_1px,_transparent_2px)] bg-[length:200px_200px,250px_250px,180px_180px] animate-pulse opacity-80" />
      </div>

      {/* Main application */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/training" element={<TrainingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>

      {/* BCI Connection Status */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`px-4 py-2 rounded-lg border backdrop-blur-sm transition-colors ${
            isBCIConnected 
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : 'bg-orange-500/20 border-orange-500/50 text-orange-400'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                isBCIConnected ? 'bg-green-400' : 'bg-orange-400'
              }`} />
              <span className="text-sm font-medium">
                BCI {isBCIConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;