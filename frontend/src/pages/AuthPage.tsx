import React from 'react';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-10 h-10 fill-slate-900">
                <rect x="45" y="57" width="30" height="6" rx="3"/>
                <circle cx="45" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                <circle cx="75" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Welcome to Bridge</h1>
          <p className="text-slate-400">Neural communication training platform</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors duration-200"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors duration-200"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 mt-6">
            Sign In
          </button>

          <div className="text-center">
            <span className="text-slate-400">Don't have an account? </span>
            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors duration-200">
              Sign up
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Or try the demo without signing up:</p>
          <a
            href="/demo.html"
            className="inline-block bg-slate-700/50 border border-amber-400/30 text-amber-400 px-6 py-2 rounded-lg hover:bg-amber-400/10 transition-colors duration-200"
          >
            🧠 Try Interactive Demo
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;