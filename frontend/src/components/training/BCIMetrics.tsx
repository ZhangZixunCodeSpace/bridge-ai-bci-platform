import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Heart, Focus, Zap, Wifi, WifiOff } from 'lucide-react';
import { NeuralState, BCIMetricsProps } from '../../types';

/**
 * BCIMetrics Component
 * 
 * Displays real-time neural metrics with animated visualizations
 * and connection status indicators for the BCI system.
 */
const BCIMetrics: React.FC<BCIMetricsProps> = ({
  neuralState,
  isConnected,
  signalQuality,
  className = ''
}) => {
  // Animation variants for metric values
  const metricVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    updated: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  // Animation variants for the neural activity indicator
  const activityVariants = {
    active: {
      backgroundColor: ['#fbbf24', '#f59e0b', '#fbbf24'],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    inactive: {
      backgroundColor: '#64748b'
    }
  };

  // Get color based on metric value and type
  const getMetricColor = (value: number, type: 'stress' | 'empathy' | 'focus' | 'regulation') => {
    if (type === 'stress') {
      if (value < 30) return 'text-green-400';
      if (value < 70) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (value < 30) return 'text-red-400';
      if (value < 70) return 'text-yellow-400';
      return 'text-green-400';
    }
  };

  // Get signal quality color
  const getSignalQualityColor = (quality: number) => {
    if (quality > 0.8) return 'text-green-400';
    if (quality > 0.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Format metric value for display
  const formatMetricValue = (value: number): string => {
    return Math.round(value).toString();
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 ${className}`}>
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            variants={activityVariants}
            animate={isConnected ? "active" : "inactive"}
            className="w-4 h-4 rounded-full"
          />
          <h3 className="text-xl font-semibold text-amber-400 flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Live Neural Monitoring</span>
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Signal Quality Indicator */}
      <div className="mb-6 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Signal Quality</span>
          <span className={`text-sm font-bold ${getSignalQualityColor(signalQuality)}`}>
            {Math.round(signalQuality * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${signalQuality * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Neural Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stress Level */}
        <motion.div
          variants={metricVariants}
          initial="hidden"
          animate="visible"
          whileHover="updated"
          className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium text-slate-300">Stress</span>
            </div>
            <motion.span
              key={neuralState.stress_level}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: 'inherit' }}
              className={`text-2xl font-bold ${getMetricColor(neuralState.stress_level, 'stress')}`}
            >
              {formatMetricValue(neuralState.stress_level)}
            </motion.span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-400"
              initial={{ width: 0 }}
              animate={{ width: `${neuralState.stress_level}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Empathy Activation */}
        <motion.div
          variants={metricVariants}
          initial="hidden"
          animate="visible"
          whileHover="updated"
          className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Empathy</span>
            </div>
            <motion.span
              key={neuralState.empathy_activation}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: 'inherit' }}
              className={`text-2xl font-bold ${getMetricColor(neuralState.empathy_activation, 'empathy')}`}
            >
              {formatMetricValue(neuralState.empathy_activation)}
            </motion.span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${neuralState.empathy_activation}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Focus Index */}
        <motion.div
          variants={metricVariants}
          initial="hidden"
          animate="visible"
          whileHover="updated"
          className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Focus className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">Focus</span>
            </div>
            <motion.span
              key={neuralState.focus_index}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: 'inherit' }}
              className={`text-2xl font-bold ${getMetricColor(neuralState.focus_index, 'focus')}`}
            >
              {formatMetricValue(neuralState.focus_index)}
            </motion.span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${neuralState.focus_index}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Emotional Regulation */}
        <motion.div
          variants={metricVariants}
          initial="hidden"
          animate="visible"
          whileHover="updated"
          className="bg-slate-800/60 rounded-lg p-4 border border-slate-700/30"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-slate-300">Regulation</span>
            </div>
            <motion.span
              key={neuralState.emotional_regulation}
              initial={{ scale: 1.2, color: '#fbbf24' }}
              animate={{ scale: 1, color: 'inherit' }}
              className={`text-2xl font-bold ${getMetricColor(neuralState.emotional_regulation, 'regulation')}`}
            >
              {formatMetricValue(neuralState.emotional_regulation)}
            </motion.span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-green-400"
              initial={{ width: 0 }}
              animate={{ width: `${neuralState.emotional_regulation}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Neural Coherence */}
      <div className="mt-6 p-4 bg-slate-800/40 rounded-lg border border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-300">Neural Coherence</span>
          </div>
          <span className="text-lg font-bold text-amber-400">
            {Math.round(neuralState.neural_coherence * 100)}%
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${neuralState.neural_coherence * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Measures synchronization between brain regions for optimal learning
        </p>
      </div>

      {/* Neural Activity Indicator */}
      <div className="mt-4 text-center">
        <motion.div
          className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800/60 rounded-full border border-slate-700/50"
          animate={isConnected ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.4 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <span className="text-xs text-slate-300">
            {isConnected ? 'Neural patterns detected' : 'Awaiting neural data'}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default BCIMetrics;