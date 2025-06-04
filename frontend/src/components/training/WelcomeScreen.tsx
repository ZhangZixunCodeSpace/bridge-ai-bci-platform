import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, BarChart3, ArrowRight, Home } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
  onGoHome: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onGoHome }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Hero Section */}
        <div className="mb-16">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-20 h-20 text-amber-400" />
              </motion.div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Rewrite That Conversation
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-300 mb-6 italic">
              "I wish I had said it differently..."
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-slate-200 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            The world's first AI+BCI platform that uses real-time neural feedback to train your brain for conflict resolution. 
            Don't just practice conversations—rewire your neural pathways for lasting communication improvements.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Start Neural Training Journey</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoHome}
            className="bg-transparent border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400/10 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Home className="w-6 h-6" />
            <span>Back to Home</span>
          </motion.button>
        </motion.div>

        {/* Process Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/20"
        >
          <h3 className="text-2xl font-bold text-amber-400 mb-8">Your Neural Training Journey</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Neural Calibration',
                description: 'Establish your personal brain baseline for optimal training',
                color: 'from-purple-400 to-pink-400',
              },
              {
                icon: Target,
                title: 'Choose Scenario',
                description: 'Select your training focus and AI partner configuration',
                color: 'from-blue-400 to-cyan-400',
              },
              {
                icon: Zap,
                title: 'BCI Training',
                description: 'Practice with real-time neural feedback and guidance',
                color: 'from-amber-400 to-orange-400',
              },
              {
                icon: BarChart3,
                title: 'Analysis',
                description: 'Review your neuroplasticity improvements and progress',
                color: 'from-green-400 to-emerald-400',
              },
            ].map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 + index * 0.1 }}
                  className="text-center group"
                >
                  <div className="relative mb-4 mx-auto w-fit">
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                    <div className={`relative bg-gradient-to-r ${step.color} p-3 rounded-xl`}>
                      <IconComponent className="w-8 h-8 text-slate-900" />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-300">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">94%</div>
            <div className="text-slate-300">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">300%</div>
            <div className="text-slate-300">Learning Speed Boost</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-400 mb-2">89%</div>
            <div className="text-slate-300">Stress Reduction</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;