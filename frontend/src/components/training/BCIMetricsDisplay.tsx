import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Heart, Zap } from 'lucide-react';

interface BCIMetrics {
  stress: number;
  empathy: number;
  focus: number;
  regulation: number;
  coherence: number;
  pathways: number;
}

interface BCIMetricsProps {
  data: BCIMetrics;
  isActive: boolean;
  onThresholdAlert?: (metric: string, value: number) => void;
}

const BCIMetricsDisplay: React.FC<BCIMetricsProps> = ({ 
  data, 
  isActive, 
  onThresholdAlert 
}) => {
  const [previousData, setPreviousData] = useState<BCIMetrics>(data);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Neural activity animation variants
  const neuralActivityVariants = {
    active: {
      opacity: [0.3, 1, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    inactive: {
      opacity: 0.3,
      scale: 1
    }
  };

  // Metric card variants
  const metricCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  // Check for threshold alerts
  useEffect(() => {
    const newAlerts: string[] = [];
    
    if (data.stress > 80) {
      newAlerts.push('High stress detected');
      onThresholdAlert?.('stress', data.stress);
    }
    
    if (data.empathy > 90) {
      newAlerts.push('Exceptional empathy activation');
      onThresholdAlert?.('empathy', data.empathy);
    }
    
    if (data.regulation < 30) {
      newAlerts.push('Low emotional regulation');
      onThresholdAlert?.('regulation', data.regulation);
    }

    setAlerts(newAlerts);
    setPreviousData(data);
  }, [data, onThresholdAlert]);

  // Calculate metric change direction
  const getMetricChange = (current: number, previous: number): 'up' | 'down' | 'stable' => {
    const diff = current - previous;
    if (Math.abs(diff) < 2) return 'stable';
    return diff > 0 ? 'up' : 'down';
  };

  // Get metric color based on value and type
  const getMetricColor = (value: number, metricType: string): string => {
    if (metricType === 'stress') {
      if (value > 70) return 'text-red-400';
      if (value > 40) return 'text-yellow-400';
      return 'text-green-400';
    }
    
    if (metricType === 'empathy' || metricType === 'focus' || metricType === 'regulation') {
      if (value > 80) return 'text-green-400';
      if (value > 60) return 'text-yellow-400';
      return 'text-red-400';
    }
    
    return 'text-blue-400';
  };

  const metrics = [
    {
      key: 'stress',
      label: 'Stress Level',
      value: data.stress,
      icon: Heart,
      description: 'Neural stress response intensity',
      unit: '%'
    },
    {
      key: 'empathy',
      label: 'Empathy Activation',
      value: data.empathy,
      icon: Brain,
      description: 'Mirror neuron network activity',
      unit: '%'
    },
    {
      key: 'focus',
      label: 'Focus Index',
      value: data.focus,
      icon: Zap,
      description: 'Attention and concentration level',
      unit: '%'
    },
    {
      key: 'regulation',
      label: 'Emotional Regulation',
      value: data.regulation,
      icon: Activity,
      description: 'Prefrontal cortex control strength',
      unit: '%'
    }
  ];

  const secondaryMetrics = [
    {
      key: 'coherence',
      label: 'Neural Coherence',
      value: data.coherence,
      description: 'Synchronization between brain regions',
      unit: ''
    },
    {
      key: 'pathways',
      label: 'New Pathways',
      value: data.pathways,
      description: 'Neural connections formed this session',
      unit: ''
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-xl">
      {/* Header with neural activity indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            variants={neuralActivityVariants}
            animate={isActive ? "active" : "inactive"}
            className="relative"
          >
            <Brain className="w-8 h-8 text-blue-400" />
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">Live Neural Monitoring</h3>
            <p className="text-sm text-blue-300">
              {isActive ? 'Real-time BCI analysis active' : 'BCI monitoring paused'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-300">
            {isActive ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Alert messages */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-2"
              >
                <p className="text-yellow-300 text-sm font-medium">⚠️ {alert}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const change = getMetricChange(metric.value, previousData[metric.key as keyof BCIMetrics]);
          const colorClass = getMetricColor(metric.value, metric.key);
          
          return (
            <motion.div
              key={metric.key}
              custom={index}
              variants={metricCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`w-5 h-5 ${colorClass}`} />
                  <span className="text-sm font-medium text-gray-300">{metric.label}</span>
                </div>
                
                {/* Change indicator */}
                {change !== 'stable' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`flex items-center space-x-1 ${
                      change === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    <span className="text-xs">
                      {change === 'up' ? '↗' : '↘'}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <motion.div
                    key={metric.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-2xl font-bold ${colorClass}`}
                  >
                    {metric.value}{metric.unit}
                  </motion.div>
                  <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
                </div>
                
                {/* Mini progress bar */}
                <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      metric.key === 'stress' 
                        ? 'bg-gradient-to-r from-green-500 to-red-500'
                        : 'bg-gradient-to-r from-red-500 to-green-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {secondaryMetrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
              <motion.div
                key={metric.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-blue-400"
              >
                {typeof metric.value === 'number' ? 
                  (metric.key === 'coherence' ? metric.value.toFixed(2) : metric.value) : 
                  metric.value
                }{metric.unit}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Neural waveform visualization */}
      <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-blue-400" />
          Neural Activity Pattern
        </h4>
        
        <div className="relative h-16 bg-slate-900/50 rounded-lg overflow-hidden">
          {/* Animated neural waveform */}
          <svg className="w-full h-full" viewBox="0 0 400 64">
            <motion.path
              d="M0,32 Q50,16 100,32 T200,32 T300,32 T400,32"
              fill="none"
              stroke="url(#neuralGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Animated dots representing neural spikes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      {/* Real-time insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg"
      >
        <h5 className="text-sm font-medium text-blue-300 mb-2">🧠 Real-time Neural Insights</h5>
        <p className="text-xs text-gray-300">
          {data.empathy > 80 ? 
            "Strong empathetic neural response detected. Mirror neurons highly active." :
            data.stress > 70 ?
            "Elevated stress response. Consider deep breathing or mindfulness techniques." :
            data.regulation > 80 ?
            "Excellent emotional regulation. Prefrontal cortex showing strong control." :
            "Neural state optimal for communication training. Continue current approach."
          }
        </p>
      </motion.div>
    </div>
  );
};

export default BCIMetricsDisplay;