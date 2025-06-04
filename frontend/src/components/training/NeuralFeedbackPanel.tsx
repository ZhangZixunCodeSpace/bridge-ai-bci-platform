import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBCI } from '../../hooks/useBCI';

interface NeuralFeedback {
  id: string;
  type: 'success' | 'warning' | 'info' | 'improvement';
  message: string;
  timestamp: number;
  duration?: number;
}

interface NeuralFeedbackPanelProps {
  className?: string;
  maxFeedbacks?: number;
  autoHide?: boolean;
}

const NeuralFeedbackPanel: React.FC<NeuralFeedbackPanelProps> = ({
  className = '',
  maxFeedbacks = 3,
  autoHide = true
}) => {
  const { data, isConnected } = useBCI();
  const [feedbacks, setFeedbacks] = useState<NeuralFeedback[]>([]);

  // Generate feedback based on BCI data changes
  useEffect(() => {
    if (!isConnected || !data) return;

    const { metrics } = data;
    const newFeedbacks: NeuralFeedback[] = [];

    // Stress level feedback
    if (metrics.stress < 30) {
      newFeedbacks.push({
        id: `stress-${Date.now()}`,
        type: 'success',
        message: '🧘 Excellent stress management! Your neural pathways are optimally regulated.',
        timestamp: Date.now(),
        duration: 4000
      });
    } else if (metrics.stress > 70) {
      newFeedbacks.push({
        id: `stress-high-${Date.now()}`,
        type: 'warning',
        message: '⚠️ High stress detected. Try deep breathing to activate your parasympathetic nervous system.',
        timestamp: Date.now(),
        duration: 5000
      });
    }

    // Focus feedback
    if (metrics.focus > 90) {
      newFeedbacks.push({
        id: `focus-${Date.now()}`,
        type: 'success',
        message: '🎯 Outstanding focus! Your prefrontal cortex is highly engaged.',
        timestamp: Date.now(),
        duration: 3000
      });
    } else if (metrics.focus < 50) {
      newFeedbacks.push({
        id: `focus-low-${Date.now()}`,
        type: 'improvement',
        message: '💡 Focus enhancement needed. Try concentrating on your breathing pattern.',
        timestamp: Date.now(),
        duration: 4000
      });
    }

    // Empathy feedback
    if (metrics.empathy > 85) {
      newFeedbacks.push({
        id: `empathy-${Date.now()}`,
        type: 'success',
        message: '🤝 Strong empathy activation! Mirror neurons are firing beautifully.',
        timestamp: Date.now(),
        duration: 3500
      });
    }

    // Emotional regulation feedback
    if (metrics.regulation > 85) {
      newFeedbacks.push({
        id: `regulation-${Date.now()}`,
        type: 'success',
        message: '⚖️ Excellent emotional regulation! Your limbic system is well-controlled.',
        timestamp: Date.now(),
        duration: 3500
      });
    }

    if (newFeedbacks.length > 0) {
      setFeedbacks(prev => {
        const updated = [...prev, ...newFeedbacks];
        return updated.slice(-maxFeedbacks);
      });
    }
  }, [data, isConnected, maxFeedbacks]);

  // Auto-hide feedbacks
  useEffect(() => {
    if (!autoHide) return;

    const timer = setInterval(() => {
      setFeedbacks(prev => 
        prev.filter(feedback => 
          Date.now() - feedback.timestamp < (feedback.duration || 4000)
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [autoHide]);

  const getFeedbackStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400';
      case 'warning':
        return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'improvement':
        return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      default:
        return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
    }
  };

  const removeFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
  };

  if (!isConnected) {
    return (
      <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-slate-500 mb-2">🧠💭</div>
          <p className="text-slate-400 text-sm">Neural feedback will appear here when BCI is connected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-800/50 to-blue-900/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-amber-400 flex items-center">
          <span className="mr-2">🧠</span>
          Neural Feedback
        </h3>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
        />
      </div>

      {/* Feedback List */}
      <div className="space-y-3 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {feedbacks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="text-slate-500 mb-2">⏳</div>
              <p className="text-slate-400 text-sm">Analyzing neural patterns...</p>
            </motion.div>
          ) : (
            feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`
                  border rounded-lg p-3 relative overflow-hidden cursor-pointer
                  ${getFeedbackStyle(feedback.type)}
                  hover:scale-105 transition-transform duration-200
                `}
                onClick={() => removeFeedback(feedback.id)}
              >
                {/* Progress bar for auto-hide */}
                {autoHide && feedback.duration && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: feedback.duration / 1000, ease: "linear" }}
                  />
                )}

                <div className="text-sm leading-relaxed">
                  {feedback.message}
                </div>

                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFeedback(feedback.id);
                  }}
                  className="absolute top-2 right-2 text-current opacity-50 hover:opacity-100 transition-opacity duration-200"
                >
                  ×
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Signal Quality Indicator */}
      {data && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Signal Quality:</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                data.signalQuality === 'excellent' ? 'bg-green-400' :
                data.signalQuality === 'good' ? 'bg-yellow-400' : 'bg-red-400'
              } animate-pulse`} />
              <span className="text-slate-300 capitalize">{data.signalQuality}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeuralFeedbackPanel;