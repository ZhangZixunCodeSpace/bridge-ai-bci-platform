import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBCI } from '../../hooks/useBCI';

interface DataPoint {
  timestamp: number;
  stress: number;
  focus: number;
  empathy: number;
  regulation: number;
}

interface NeuralVisualizerProps {
  className?: string;
  duration?: number; // Duration in milliseconds to show data
  refreshRate?: number; // Refresh rate in milliseconds
}

const NeuralVisualizer: React.FC<NeuralVisualizerProps> = ({
  className = '',
  duration = 60000, // 1 minute
  refreshRate = 1000 // 1 second
}) => {
  const { data, isConnected } = useBCI();
  const [dataHistory, setDataHistory] = useState<DataPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Collect data points
  useEffect(() => {
    if (!isConnected || !data || !isRecording) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newPoint: DataPoint = {
        timestamp: now,
        stress: data.metrics.stress,
        focus: data.metrics.focus,
        empathy: data.metrics.empathy,
        regulation: data.metrics.regulation
      };

      setDataHistory(prev => {
        const filtered = prev.filter(point => now - point.timestamp < duration);
        return [...filtered, newPoint].slice(-60); // Keep max 60 points
      });
    }, refreshRate);

    return () => clearInterval(interval);
  }, [isConnected, data, isRecording, duration, refreshRate]);

  const toggleRecording = () => {
    if (!isRecording) {
      setDataHistory([]); // Clear previous data
    }
    setIsRecording(!isRecording);
  };

  const getPathForMetric = (metric: keyof Omit<DataPoint, 'timestamp'>) => {
    if (dataHistory.length < 2) return '';

    const width = 400;
    const height = 100;
    const padding = 10;

    const maxValue = 100;
    const minValue = 0;

    return dataHistory.map((point, index) => {
      const x = padding + (index / (dataHistory.length - 1)) * (width - 2 * padding);
      const normalizedValue = (point[metric] - minValue) / (maxValue - minValue);
      const y = height - padding - normalizedValue * (height - 2 * padding);
      
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    }).join(' ');
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'stress': return '#ef4444'; // red
      case 'focus': return '#3b82f6'; // blue
      case 'empathy': return '#10b981'; // green
      case 'regulation': return '#f59e0b'; // amber
      default: return '#6b7280';
    }
  };

  const getCurrentStats = () => {
    if (dataHistory.length === 0) return null;

    const latest = dataHistory[dataHistory.length - 1];
    const earliest = dataHistory[0];

    return {
      stress: {
        current: latest.stress,
        change: latest.stress - earliest.stress,
        trend: latest.stress < earliest.stress ? 'improving' : 'declining'
      },
      focus: {
        current: latest.focus,
        change: latest.focus - earliest.focus,
        trend: latest.focus > earliest.focus ? 'improving' : 'declining'
      },
      empathy: {
        current: latest.empathy,
        change: latest.empathy - earliest.empathy,
        trend: latest.empathy > earliest.empathy ? 'improving' : 'declining'
      },
      regulation: {
        current: latest.regulation,
        change: latest.regulation - earliest.regulation,
        trend: latest.regulation > earliest.regulation ? 'improving' : 'declining'
      }
    };
  };

  const stats = getCurrentStats();

  if (!isConnected) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-slate-500 mb-4">📊🧠</div>
          <p className="text-slate-400">BCI connection required for neural visualization</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-amber-400 flex items-center">
          <span className="mr-2">📊</span>
          Neural Activity Visualizer
        </h3>
        
        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            isRecording 
              ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30' 
              : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
          }`}
        >
          {isRecording ? '⏹️ Stop Recording' : '▶️ Start Recording'}
        </button>
      </div>

      {/* Graph Area */}
      <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700/50">
        <svg
          width="100%"
          height="120"
          viewBox="0 0 400 120"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="400" height="120" fill="url(#grid)" />

          {/* Metric lines */}
          {['stress', 'focus', 'empathy', 'regulation'].map((metric) => (
            <motion.path
              key={metric}
              d={getPathForMetric(metric as keyof Omit<DataPoint, 'timestamp'>)}
              fill="none"
              stroke={getMetricColor(metric)}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                filter: `drop-shadow(0 0 4px ${getMetricColor(metric)}40)`
              }}
            />
          ))}

          {/* Current value indicators */}
          {dataHistory.length > 0 && ['stress', 'focus', 'empathy', 'regulation'].map((metric) => {
            const latest = dataHistory[dataHistory.length - 1];
            const x = 400 - 10;
            const normalizedValue = (latest[metric as keyof Omit<DataPoint, 'timestamp'>]) / 100;
            const y = 120 - 10 - normalizedValue * 100;
            
            return (
              <circle
                key={`${metric}-indicator`}
                cx={x}
                cy={y}
                r="4"
                fill={getMetricColor(metric)}
                className="animate-pulse"
              />
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex justify-center mt-4 space-x-6">
          {[
            { key: 'stress', label: 'Stress', color: '#ef4444' },
            { key: 'focus', label: 'Focus', color: '#3b82f6' },
            { key: 'empathy', label: 'Empathy', color: '#10b981' },
            { key: 'regulation', label: 'Regulation', color: '#f59e0b' }
          ].map((item) => (
            <div key={item.key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats).map(([metric, data]) => (
            <div key={metric} className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">
                {metric}
              </div>
              <div className="text-lg font-bold text-slate-100 mb-1">
                {Math.round(data.current)}
              </div>
              <div className={`text-xs flex items-center ${
                data.trend === 'improving' ? 'text-green-400' : 'text-orange-400'
              }`}>
                <span className="mr-1">
                  {data.trend === 'improving' ? '↗️' : '↘️'}
                </span>
                {data.change > 0 ? '+' : ''}{Math.round(data.change)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recording Info */}
      <div className="mt-4 text-center">
        <div className="text-xs text-slate-500">
          {isRecording ? (
            <>
              <span className="text-red-400 animate-pulse">● Recording</span>
              {` • ${dataHistory.length} data points • ${Math.round(duration / 1000)}s window`}
            </>
          ) : (
            `Ready to record neural activity • ${Math.round(duration / 1000)}s window`
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralVisualizer;