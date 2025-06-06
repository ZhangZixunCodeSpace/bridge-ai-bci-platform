import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Sparkles,
  Heart,
  Shield
} from 'lucide-react';
import { NeuralEvent, TrainingRecommendation, NeuralFeedbackProps } from '../../types';

/**
 * NeuralFeedbackPanel Component
 * 
 * Provides real-time neural insights, coaching feedback, and training recommendations
 * based on live BCI data analysis during communication training sessions.
 */
const NeuralFeedbackPanel: React.FC<NeuralFeedbackProps> = ({
  events,
  insights,
  recommendations,
  className = ''
}) => {
  const [currentInsight, setCurrentInsight] = useState<string>('');
  const [insightIndex, setInsightIndex] = useState(0);
  const [recentEvents, setRecentEvents] = useState<NeuralEvent[]>([]);

  // Rotate through insights every 5 seconds
  useEffect(() => {
    if (insights.length > 0) {
      const interval = setInterval(() => {
        setInsightIndex((prev) => (prev + 1) % insights.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [insights.length]);

  // Update current insight when index changes
  useEffect(() => {
    if (insights.length > 0) {
      setCurrentInsight(insights[insightIndex]);
    }
  }, [insights, insightIndex]);

  // Keep track of recent events (last 5)
  useEffect(() => {
    setRecentEvents(events.slice(-5));
  }, [events]);

  // Get icon for event type
  const getEventIcon = (type: NeuralEvent['type']) => {
    switch (type) {
      case 'stress_threshold':
        return <AlertTriangle className="w-4 h-4" />;
      case 'empathy_spike':
        return <Heart className="w-4 h-4" />;
      case 'attention_drop':
        return <Brain className="w-4 h-4" />;
      case 'regulation_improvement':
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Get color for event severity
  const getEventColor = (severity: NeuralEvent['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'positive':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  // Get icon for recommendation priority
  const getRecommendationIcon = (priority: TrainingRecommendation['priority']) => {
    switch (priority) {
      case 'high':
        return <Target className="w-4 h-4 text-red-400" />;
      case 'medium':
        return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'low':
        return <Lightbulb className="w-4 h-4 text-blue-400" />;
      default:
        return <Info className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Real-time Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-amber-400">Neural Insights</h3>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={insightIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[60px] flex items-center"
          >
            <p className="text-slate-200 leading-relaxed">
              {currentInsight || 'Analyzing your neural patterns...'}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Insight navigation dots */}
        {insights.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setInsightIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === insightIndex ? 'bg-amber-400' : 'bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Neural Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-200">Neural Events</h3>
          {recentEvents.length > 0 && (
            <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
              {recentEvents.length} recent
            </span>
          )}
        </div>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          <AnimatePresence>
            {recentEvents.length > 0 ? (
              recentEvents.map((event, index) => (
                <motion.div
                  key={`${event.timestamp}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${getEventColor(event.severity)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 mb-1">
                        {event.message}
                      </p>
                      {event.recommendation && (
                        <p className="text-xs text-slate-400">
                          💡 {event.recommendation}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-slate-700/50 rounded-full text-slate-400">
                          {Math.round(event.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No neural events detected yet</p>
                <p className="text-xs mt-1">Events will appear as your brain responds to training</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Training Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h3 className="text-lg font-semibold text-slate-200">Recommendations</h3>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto">
          {recommendations.length > 0 ? (
            recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-green-500/30 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getRecommendationIcon(recommendation.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-200">
                        {recommendation.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        recommendation.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400'
                          : recommendation.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {recommendation.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                      {recommendation.description}
                    </p>
                    <p className="text-xs text-slate-400 mb-2">
                      <strong>Why:</strong> {recommendation.reasoning}
                    </p>
                    <p className="text-xs text-green-400">
                      <strong>Expected benefit:</strong> {recommendation.expected_benefit}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No specific recommendations yet</p>
              <p className="text-xs mt-1">Continue training to receive personalized guidance</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Neural Training Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-200">Neural Adaptation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-xs text-purple-400">Learning in progress</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "65%" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Your brain is actively forming new neural pathways for better communication
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NeuralFeedbackPanel;