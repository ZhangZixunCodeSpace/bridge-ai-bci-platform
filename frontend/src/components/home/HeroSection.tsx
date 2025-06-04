import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartTraining: () => void;
  onInvestmentInfo: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartTraining, onInvestmentInfo }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-32 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mr-4"
            >
              <Brain className="w-full h-full text-amber-400" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
              Bridge
            </h1>
          </div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl md:text-4xl font-semibold text-slate-300 mb-4 italic"
          >
            "I wish I had said it differently..."
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-200 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          The world's first AI+BCI platform that uses real-time neural feedback to train your brain for conflict resolution. 
          Don't just practice conversations—rewire your neural pathways for lasting communication improvements.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 191, 36, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartTraining}
            className="group bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Brain className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Start Neural Training Journey</span>
            <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInvestmentInfo}
            className="bg-transparent border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-400/10 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Sparkles className="w-6 h-6" />
            <span>Investment Overview</span>
          </motion.button>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">94%</div>
            <div className="text-slate-300">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">$1T</div>
            <div className="text-slate-300">Market Opportunity</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">300%</div>
            <div className="text-slate-300">Learning Speed Boost</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-slate-400"
        >
          <span className="text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-slate-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;