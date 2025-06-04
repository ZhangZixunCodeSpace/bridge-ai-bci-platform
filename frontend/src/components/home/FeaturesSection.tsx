import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, BarChart3, Users, Sparkles, Activity, Shield } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Neural Calibration',
    description: 'Personalized brain baseline establishment using advanced EEG monitoring for optimal training effectiveness.',
    gradient: 'from-purple-400 to-pink-400',
    delay: 0,
  },
  {
    icon: Target,
    title: 'AI-Powered Scenarios',
    description: 'Realistic conflict simulation with fully customizable AI partners that adapt to your communication style.',
    gradient: 'from-blue-400 to-cyan-400',
    delay: 0.1,
  },
  {
    icon: Zap,
    title: 'Real-time BCI Feedback',
    description: 'Live neural monitoring and guidance during conversations to optimize your emotional and cognitive responses.',
    gradient: 'from-amber-400 to-orange-400',
    delay: 0.2,
  },
  {
    icon: BarChart3,
    title: 'Neuroplasticity Analytics',
    description: 'Scientific measurement of brain changes with detailed reports showing your neural pathway improvements.',
    gradient: 'from-green-400 to-emerald-400',
    delay: 0.3,
  },
  {
    icon: Activity,
    title: 'Emotion Recognition',
    description: 'Advanced algorithms detect and analyze emotional states with 95%+ accuracy for precise feedback.',
    gradient: 'from-red-400 to-rose-400',
    delay: 0.4,
  },
  {
    icon: Users,
    title: 'Collaborative Training',
    description: 'Team-based scenarios for workplace communication with multi-user neural synchronization.',
    gradient: 'from-indigo-400 to-purple-400',
    delay: 0.5,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: feature.delay }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative"
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-slate-600/50 group-hover:bg-slate-800/70">
              {/* Icon with gradient background */}
              <div className="relative mb-6">
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                <div className={`relative bg-gradient-to-r ${feature.gradient} p-3 rounded-xl w-fit`}>
                  <IconComponent className="w-8 h-8 text-slate-900" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {feature.description}
              </p>

              {/* Hover effect indicator */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                layoutId={`feature-indicator-${index}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeaturesSection;