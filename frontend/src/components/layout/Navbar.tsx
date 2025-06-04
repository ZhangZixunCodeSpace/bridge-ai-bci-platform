import React from 'react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-amber-400/20"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 120 120" className="w-6 h-6 fill-slate-900">
                <rect x="45" y="57" width="30" height="6" rx="3"/>
                <circle cx="45" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                <circle cx="75" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Bridge
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200 font-medium"
            >
              Home
            </a>
            <a
              href="/demo.html"
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200 font-medium"
            >
              Demo
            </a>
            <a
              href="/training"
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200 font-medium"
            >
              Training
            </a>
            <a
              href="/dashboard"
              className="text-slate-300 hover:text-amber-400 transition-colors duration-200 font-medium"
            >
              Dashboard
            </a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <a
              href="/demo.html"
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 text-sm"
            >
              Try Demo
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;