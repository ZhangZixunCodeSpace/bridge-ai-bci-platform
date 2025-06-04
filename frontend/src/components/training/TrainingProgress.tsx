import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrainingStep {
  id: string;
  emoji: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed';
}

interface TrainingProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

const TrainingProgress: React.FC<TrainingProgressProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  className = ''
}) => {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const defaultSteps: TrainingStep[] = [
    {
      id: 'calibration',
      emoji: '🔬',
      title: 'Neural Calibration',
      description: 'Establish your personal brain baseline',
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'
    },
    {
      id: 'scenario',
      emoji: '🎯',
      title: 'Choose Scenario',
      description: 'Select your training focus',
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'
    },
    {
      id: 'training',
      emoji: '⚡',
      title: 'BCI Training',
      description: 'Real-time neural feedback',
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'
    },
    {
      id: 'analysis',
      emoji: '📊',
      title: 'Analysis',
      description: 'Review your progress',
      status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending'
    }
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-500/20 text-emerald-400';
      case 'active':
        return 'border-amber-400 bg-amber-400/20 text-amber-400';
      default:
        return 'border-slate-600 bg-slate-800/50 text-slate-400';
    }
  };

  const getConnectorColor = (index: number) => {
    if (currentStep > index + 1) {
      return 'bg-emerald-500 shadow-emerald-500/50';
    }
    return 'bg-slate-600';
  };

  return (
    <div className={`bg-slate-900/80 backdrop-blur-sm border-b border-amber-400/20 py-6 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {defaultSteps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <motion.div
                className="relative"
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`
                    w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer
                    transition-all duration-300 relative z-10
                    ${getStepColor(step.status)}
                    ${step.status === 'active' ? 'shadow-lg shadow-amber-400/30' : ''}
                    ${onStepClick ? 'hover:scale-110' : ''}
                  `}
                  onClick={() => onStepClick?.(index + 1)}
                >
                  <span className="text-2xl">{step.emoji}</span>
                  
                  {/* Active step pulse animation */}
                  {step.status === 'active' && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-amber-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div className={`text-sm font-semibold ${
                    step.status === 'completed' ? 'text-emerald-400' :
                    step.status === 'active' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </div>
                </div>

                {/* Hover Tooltip */}
                <AnimatePresence>
                  {hoveredStep === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20"
                    >
                      <div className="bg-slate-800 border border-amber-400/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                        <div className="text-sm text-slate-300 whitespace-nowrap">
                          {step.description}
                        </div>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="w-4 h-4 bg-slate-800 border-l border-t border-amber-400/30 transform rotate-45"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Connector Line */}
              {index < defaultSteps.length - 1 && (
                <motion.div
                  className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${getConnectorColor(index)}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ boxShadow: currentStep > index + 1 ? '0 0 10px currentColor' : 'none' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-amber-400">Training Progress</span>
            <span className="text-sm text-slate-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgress;