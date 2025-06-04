import React from 'react';
import { motion } from 'framer-motion';
import { useBCI } from '../../hooks/useBCI';

interface BCIMetricsProps {
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const BCIMetrics: React.FC<BCIMetricsProps> = ({ 
  showLabels = true, 
  size = 'medium',
  className = '' 
}) => {
  const { data, isConnected } = useBCI();

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const getMetricColor = (value: number, type: 'stress' | 'focus' | 'empathy' | 'regulation') => {
    switch (type) {
      case 'stress':
        return value < 30 ? 'text-green-400' : value < 60 ? 'text-yellow-400' : 'text-red-400';
      case 'focus':
      case 'empathy':
      case 'regulation':
        return value > 80 ? 'text-green-400' : value > 60 ? 'text-yellow-400' : 'text-red-400';
      default:
        return 'text-amber-400';
    }
  };

  if (!isConnected || !data) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-slate-500 mb-4">🧠</div>
          <p className="text-slate-400">BCI Disconnected</p>
          <p className="text-xs text-slate-500 mt-2">Connect your BCI device to see live metrics</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 relative overflow-hidden ${className}`}
    >
      {/* Neural activity indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 rounded-full animate-pulse"></div>
      
      {showLabels && (
        <h3 className="text-lg font-semibold text-amber-400 mb-4 text-center">
          🧠 Live Neural Metrics
        </h3>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className={`${sizeClasses[size]} font-bold ${getMetricColor(data.metrics.stress, 'stress')} mb-1`}>
            {Math.round(data.metrics.stress)}
          </div>
          {showLabels && <div className="text-xs text-slate-400">Stress</div>}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="text-center"
        >
          <div className={`${sizeClasses[size]} font-bold ${getMetricColor(data.metrics.focus, 'focus')} mb-1`}>
            {Math.round(data.metrics.focus)}
          </div>
          {showLabels && <div className="text-xs text-slate-400">Focus</div>}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="text-center"
        >
          <div className={`${sizeClasses[size]} font-bold ${getMetricColor(data.metrics.empathy, 'empathy')} mb-1`}>
            {Math.round(data.metrics.empathy)}
          </div>
          {showLabels && <div className="text-xs text-slate-400">Empathy</div>}
        </motion.div>

        <motion.div
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          className="text-center"
        >
          <div className={`${sizeClasses[size]} font-bold ${getMetricColor(data.metrics.regulation, 'regulation')} mb-1`}>
            {Math.round(data.metrics.regulation)}
          </div>
          {showLabels && <div className="text-xs text-slate-400">Regulation</div>}
        </motion.div>
      </div>

      {showLabels && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400">
              Signal Quality: {data.signalQuality}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BCIMetrics;