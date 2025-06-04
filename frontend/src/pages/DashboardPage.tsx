import React from 'react';
import { motion } from 'framer-motion';
import { useBCI } from '../hooks/useBCI';
import { getAnalyticsEvents } from '../services/analytics';

const DashboardPage: React.FC = () => {
  const { isConnected, data } = useBCI();
  const analyticsEvents = getAnalyticsEvents();

  return (
    <div className="min-h-screen pt-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              Neural Training Dashboard
            </h1>
            <p className="text-xl text-slate-300">
              Monitor your communication skills progress and BCI metrics
            </p>
          </div>

          {/* BCI Status */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-amber-400 font-semibold">BCI Connection</h3>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
              </div>
              <p className="text-2xl font-bold text-slate-100">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </motion.div>

            {data && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6"
                >
                  <h3 className="text-amber-400 font-semibold mb-4">Stress Level</h3>
                  <p className="text-3xl font-bold text-slate-100">{Math.round(data.metrics.stress)}</p>
                  <p className="text-sm text-slate-400">Lower is better</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6"
                >
                  <h3 className="text-amber-400 font-semibold mb-4">Focus Index</h3>
                  <p className="text-3xl font-bold text-slate-100">{Math.round(data.metrics.focus)}</p>
                  <p className="text-sm text-slate-400">Concentration level</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6"
                >
                  <h3 className="text-amber-400 font-semibold mb-4">Empathy Score</h3>
                  <p className="text-3xl font-bold text-slate-100">{Math.round(data.metrics.empathy)}</p>
                  <p className="text-sm text-slate-400">Neural empathy level</p>
                </motion.div>
              </>
            )}
          </div>

          {/* Training History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-8 mb-12"
          >
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {analyticsEvents.slice(-5).reverse().map((event, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-b-0">
                  <div>
                    <p className="text-slate-300 font-medium">{event.event.replace(/_/g, ' ').toUpperCase()}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(event.timestamp || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-amber-400 text-sm">
                    {event.properties?.type || 'activity'}
                  </div>
                </div>
              ))}
              {analyticsEvents.length === 0 && (
                <p className="text-slate-400 text-center py-8">
                  No activity yet. Start a training session to see your progress!
                </p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            <a
              href="/demo.html"
              className="bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-xl p-8 hover:border-amber-400/50 transition-colors duration-200 group"
            >
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-bold text-amber-400 mb-2 group-hover:text-amber-300">
                Start Training Session
              </h3>
              <p className="text-slate-300">
                Begin a new neural communication training with real-time BCI feedback
              </p>
            </a>

            <a
              href="/training"
              className="bg-gradient-to-br from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-8 hover:border-blue-400/50 transition-colors duration-200 group"
            >
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-blue-400 mb-2 group-hover:text-blue-300">
                View Progress
              </h3>
              <p className="text-slate-300">
                Analyze your communication improvements and neural pathway development
              </p>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;