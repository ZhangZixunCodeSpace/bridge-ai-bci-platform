import React from 'react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
            404
          </div>
          <div className="text-6xl mb-6">🧠❌</div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Neural Pathway Not Found
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            It looks like this communication channel has been disconnected.
          </p>
          <p className="text-lg text-slate-400">
            The page you're looking for doesn't exist in our neural network.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="/"
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            🏠 Return Home
          </a>
          <a
            href="/demo.html"
            className="bg-amber-400/10 border border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400/20 transition-colors duration-200"
          >
            🧠 Try Demo
          </a>
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16"
        >
          <div className="flex justify-center space-x-4 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-amber-400/50 rounded-full"
              />
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            Neural pathways reconnecting...
          </p>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 p-6 bg-slate-800/30 backdrop-blur-sm border border-amber-400/20 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-amber-400 mb-4">
            Popular Destinations
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <a href="/training" className="text-slate-300 hover:text-amber-400 transition-colors duration-200">
              → Training Platform
            </a>
            <a href="/dashboard" className="text-slate-300 hover:text-amber-400 transition-colors duration-200">
              → Dashboard
            </a>
            <a href="/auth" className="text-slate-300 hover:text-amber-400 transition-colors duration-200">
              → Sign In
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;