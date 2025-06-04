import React from 'react';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center"
            >
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 120 120" className="w-10 h-10 fill-slate-900">
                    <rect x="45" y="57" width="30" height="6" rx="3"/>
                    <circle cx="45" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                    <circle cx="75" cy="60" r="6" fill="none" stroke="currentColor" strokeWidth="3"/>
                  </svg>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Bridge
                </h1>
              </div>
            </motion.div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <span className="inline-block px-4 py-2 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-sm font-medium">
                AI+BCI Neural Communication Training
              </span>
            </motion.div>

            {/* Hero Text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-5xl font-bold tracking-tight text-slate-100 sm:text-7xl mb-6"
            >
              Rewrite That{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Conversation
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl leading-8 text-slate-300 mb-4 italic"
            >
              "I wish I had said it differently..."
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="text-lg leading-8 text-slate-300 max-w-3xl mx-auto mb-12"
            >
              The world's first AI+BCI platform that uses real-time neural feedback to train your brain 
              for conflict resolution. Don't just practice conversations—rewire your neural pathways 
              for lasting communication improvements.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <a
                href="/demo.html"
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-amber-400/25"
              >
                🧠 Try Interactive Demo
              </a>
              <a
                href="/training"
                className="bg-amber-400/10 border border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400/20 transition-colors duration-200"
              >
                📱 Enter React App
              </a>
            </motion.div>

            {/* BCI Demo Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-8 max-w-2xl mx-auto"
            >
              <div className="relative">
                {/* Neural activity indicator */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 rounded-full animate-pulse"></div>
                
                <h3 className="text-xl font-semibold text-amber-400 mb-6 text-center">
                  🧠 Live Neural Demo - Your Brain State Now
                </h3>
                
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2 animate-pulse">
                      {Math.floor(Math.random() * 20) + 20}
                    </div>
                    <div className="text-sm text-slate-400">Stress Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2 animate-pulse">
                      {Math.floor(Math.random() * 15) + 85}
                    </div>
                    <div className="text-sm text-slate-400">Focus Index</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400 mb-2 animate-pulse">
                      {Math.floor(Math.random() * 20) + 70}
                    </div>
                    <div className="text-sm text-slate-400">Empathy Score</div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-slate-400">
                  ⚡ Simulated BCI reading - Your actual neural patterns would be monitored during training
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-slate-100 mb-4">
              How Bridge Works
            </h3>
            <p className="text-lg text-slate-300">
              Revolutionary technology meets human communication
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🔬',
                title: 'Neural Calibration',
                description: 'Establish your personal brain baseline for optimal training effectiveness'
              },
              {
                emoji: '🎯',
                title: 'Choose Scenario',
                description: 'Select from relationship, workplace, or family conflict scenarios'
              },
              {
                emoji: '⚡',
                title: 'BCI Training',
                description: 'Real-time neural feedback guides you to better communication patterns'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 text-center hover:border-amber-400/40 transition-colors duration-200"
              >
                <div className="text-4xl mb-4">{feature.emoji}</div>
                <h4 className="text-xl font-semibold text-amber-400 mb-3">{feature.title}</h4>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Investment CTA */}
      <div className="px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl bg-gradient-to-br from-slate-800/70 to-blue-900/70 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-100 mb-4">
            💼 Investment Opportunity
          </h3>
          <p className="text-slate-300 mb-6">
            Series A: $80M to dominate the $1T neural communication market
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">5-Year Projections:</h4>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• Year 3: $9.6B revenue, 30M BCI users</li>
                <li>• Year 5: $45B revenue, 150M users</li>
                <li>• 125-190x potential ROI</li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-400 font-semibold mb-2">Revolutionary Technology:</h4>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• World's first AI+BCI communication platform</li>
                <li>• Real-time neural feedback training</li>
                <li>• Scientifically proven neuroplasticity results</li>
              </ul>
            </div>
          </div>
          <a
            href="mailto:investors@bridge-ai.com"
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-200"
          >
            📧 Contact Investors
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;