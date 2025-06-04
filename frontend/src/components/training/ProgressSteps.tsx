import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  emoji: string;
  label: string;
  completed?: boolean;
  active?: boolean;
}

interface ProgressStepsProps {
  steps: Step[];
  className?: string;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-bridge-dark/80 backdrop-blur-sm py-6 ${className}`}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 border-2 transition-all duration-300 ${
                      step.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : step.active
                        ? 'bg-bridge-amber border-bridge-amber text-bridge-dark shadow-lg shadow-bridge-amber/30 scale-110'
                        : 'bg-bridge-amber/20 border-bridge-amber/30 text-slate-400'
                    }`}
                    whileHover={{ scale: step.active ? 1.15 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {step.completed ? '✓' : step.emoji}
                  </motion.div>
                  <span
                    className={`text-sm font-medium text-center transition-colors duration-300 ${
                      step.completed
                        ? 'text-emerald-400'
                        : step.active
                        ? 'text-bridge-amber'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: (index + 1) * 0.1 }}
                    className={`w-12 h-0.5 transition-all duration-300 ${
                      step.completed
                        ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                        : 'bg-bridge-amber/30'
                    }`}
                    style={{ originX: 0 }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressSteps;