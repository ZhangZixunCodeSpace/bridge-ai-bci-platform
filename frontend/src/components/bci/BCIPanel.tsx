import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BCIMetrics {
  stress: number;
  focus: number;
  empathy: number;
  regulation?: number;
}

interface BCIPanelProps {
  title?: string;
  metrics: BCIMetrics;
  isActive?: boolean;
  className?: string;
  showStatus?: boolean;
  statusText?: string;
}

const BCIPanel: React.FC<BCIPanelProps> = ({
  title = "🧠 Live Neural Monitoring",
  metrics,
  isActive = true,
  className = "",
  showStatus = false,
  statusText = "Neural patterns detected"
}) => {
  const [animatedMetrics, setAnimatedMetrics] = useState(metrics);

  // Animate metrics changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedMetrics(prev => ({
        stress: Math.max(10, Math.min(100, prev.stress + (Math.random() - 0.5) * 4)),
        focus: Math.max(60, Math.min(100, prev.focus + (Math.random() - 0.5) * 3)),
        empathy: Math.max(50, Math.min(100, prev.empathy + (Math.random() - 0.5) * 3)),
        regulation: prev.regulation ? Math.max(40, Math.min(100, prev.regulation + (Math.random() - 0.5) * 5)) : undefined
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getMetricColor = (value: number, type: string) => {
    if (type === 'stress') {
      return value < 30 ? 'text-emerald-400' : value < 60 ? 'text-amber-400' : 'text-red-400';
    }
    return value > 70 ? 'text-emerald-400' : value > 50 ? 'text-amber-400' : 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-bridge-dark/90 to-blue-900/80 backdrop-blur-sm 
        border border-bridge-amber/20 rounded-2xl p-6 relative overflow-hidden ${className}`}
    >
      {/* Neural activity indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bridge-amber via-bridge-orange to-emerald-500 rounded-full animate-bci-signal"></div>
      )}
      
      <h3 className="text-xl font-semibold text-bridge-amber mb-6 text-center">
        {title}
      </h3>
      
      <div className={`grid ${animatedMetrics.regulation ? 'grid-cols-4' : 'grid-cols-3'} gap-6 mb-6`}>
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            key={animatedMetrics.stress}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold mb-2 ${getMetricColor(animatedMetrics.stress, 'stress')} transition-colors duration-500`}
          >
            {Math.round(animatedMetrics.stress)}
          </motion.div>
          <div className="text-sm text-slate-400">Stress Level</div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            key={animatedMetrics.focus}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold mb-2 ${getMetricColor(animatedMetrics.focus, 'focus')} transition-colors duration-500`}
          >
            {Math.round(animatedMetrics.focus)}
          </motion.div>
          <div className="text-sm text-slate-400">Focus Index</div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            key={animatedMetrics.empathy}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-3xl font-bold mb-2 ${getMetricColor(animatedMetrics.empathy, 'empathy')} transition-colors duration-500`}
          >
            {Math.round(animatedMetrics.empathy)}
          </motion.div>
          <div className="text-sm text-slate-400">Empathy Score</div>
        </motion.div>

        {animatedMetrics.regulation && (
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              key={animatedMetrics.regulation}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`text-3xl font-bold mb-2 ${getMetricColor(animatedMetrics.regulation, 'regulation')} transition-colors duration-500`}
            >
              {Math.round(animatedMetrics.regulation)}
            </motion.div>
            <div className="text-sm text-slate-400">Regulation</div>
          </motion.div>
        )}
      </div>
      
      {showStatus && (
        <div className="bg-white/10 rounded-lg p-4">
          <h4 className="text-emerald-400 font-medium mb-2">⚡ Status</h4>
          <p className="text-sm text-slate-300">{statusText}</p>
        </div>
      )}
    </motion.div>
  );
};

export default BCIPanel;