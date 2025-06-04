import React from 'react';
import { motion } from 'framer-motion';
import { TrainingStep } from '../../pages/TrainingPage';

interface ProgressBarProps {
  steps: TrainingStep[];
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border-b border-amber-400/20 py-6">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = step.completed;
            const stepNumber = index + 1;
            
            return (
              <React.Fragment key={step.id}>
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isActive
                        ? 'bg-amber-400 border-amber-400 text-slate-900 scale-110 shadow-lg shadow-amber-400/50'
                        : 'bg-slate-700 border-slate-600 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ) : (
                      <span className="text-2xl">{step.icon}</span>
                    )}
                    
                    {/* Active pulse effect */}
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-amber-400"
                      />
                    )}
                  </motion.div>
                  
                  {/* Step Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`mt-3 text-center transition-colors duration-300 ${
                      isCompleted
                        ? 'text-green-400'
                        : isActive
                        ? 'text-amber-400'
                        : 'text-slate-500'
                    }`}
                  >
                    <div className="text-sm font-semibold">{step.title}</div>
                  </motion.div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="h-0.5 bg-slate-700 rounded-full" />
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: isCompleted ? '100%' : '0%' 
                        }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute top-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-sm shadow-green-400/50"
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;