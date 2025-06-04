import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Zap } from 'lucide-react';

const BCIDemo: React.FC = () => {
  const [metrics, setMetrics] = useState({
    stress: 24,
    focus: 88,
    empathy: 76,
  });

  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        stress: Math.max(15, Math.min(35, prev.stress + (Math.random() - 0.5) * 4)),
        focus: Math.max(80, Math.min(95, prev.focus + (Math.random() - 0.5) * 3)),
        empathy: Math.max(70, Math.min(85, prev.empathy + (Math.random() - 0.5) * 3)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const getMetricColor = (value: number, type: 'stress' | 'focus' | 'empathy') => {
    if (type === 'stress') {
      return value < 25 ? 'text-green-400' : value < 30 ? 'text-yellow-400' : 'text-red-400';
    }
    return value > 80 ? 'text-green-400' : value > 70 ? 'text-yellow-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      {/* Neural activity animation border */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 p-[2px] rounded-2xl">
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-amber-400 mr-3" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-amber-400">
              Live Neural Demo - Your Brain State Now
            </h3>
          </div>
          <p className="text-slate-300">
            Real-time BCI simulation showing your current neural patterns
          </p>
        </div>

        {/* Metrics Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Stress Level */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className={`text-4xl md:text-5xl font-bold mb-2 transition-colors duration-500 ${
              getMetricColor(metrics.stress, 'stress')
            }`}>
              {Math.round(metrics.stress)}
            </div>
            <div className="text-slate-400 text-lg">Stress Level</div>
            <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-red-400"
                style={{ width: `${(metrics.stress / 50) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Focus Index */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="text-center"
          >
            <div className={`text-4xl md:text-5xl font-bold mb-2 transition-colors duration-500 ${
              getMetricColor(metrics.focus, 'focus')
            }`}>
              {Math.round(metrics.focus)}
            </div>
            <div className="text-slate-400 text-lg">Focus Index</div>
            <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-400 to-green-400"
                style={{ width: `${metrics.focus}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Empathy Score */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            className="text-center"
          >
            <div className={`text-4xl md:text-5xl font-bold mb-2 transition-colors duration-500 ${
              getMetricColor(metrics.empathy, 'empathy')
            }`}>
              {Math.round(metrics.empathy)}
            </div>
            <div className="text-slate-400 text-lg">Empathy Score</div>
            <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-400 to-green-400"
                style={{ width: `${metrics.empathy}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Neural Activity Visualization */}
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-green-400 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Neural Activity Pattern
            </h4>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-slate-600/20 text-slate-400 border border-slate-500/50'
              }`}
            >
              {isActive ? 'Live' : 'Paused'}
            </button>
          </div>
          
          {/* Simulated EEG waves */}
          <div className="h-24 bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="flex space-x-1">
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-400"
                  animate={{
                    height: isActive ? [
                      Math.random() * 60 + 10,
                      Math.random() * 60 + 10,
                      Math.random() * 60 + 10,
                    ] : [20]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    delay: i * 0.05,
                  }}
                  style={{ height: '20px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-5 h-5 text-amber-400 mr-2" />
            </motion.div>
            <span className="text-sm text-slate-300">
              Simulated BCI reading - Your actual neural patterns would be monitored during training
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Bridge uses advanced EEG technology to provide real-time feedback on your brain state
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BCIDemo;