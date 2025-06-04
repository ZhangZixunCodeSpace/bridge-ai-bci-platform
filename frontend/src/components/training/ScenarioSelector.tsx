import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../services/analytics';

interface TrainingScenario {
  id: string;
  emoji: string;
  title: string;
  description: string;
  category: 'relationship' | 'workplace' | 'family' | 'social';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  focusAreas: string[];
  exampleConflict: string;
  neuralTargets: {
    stress: 'reduce' | 'maintain' | 'increase';
    empathy: 'reduce' | 'maintain' | 'increase';
    regulation: 'reduce' | 'maintain' | 'increase';
    focus: 'reduce' | 'maintain' | 'increase';
  };
  unlocked: boolean;
  completionRate?: number;
}

interface ScenarioSelectorProps {
  onScenarioSelect: (scenario: TrainingScenario) => void;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  onScenarioSelect,
  userLevel = 'beginner',
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedScenario, setSelectedScenario] = useState<TrainingScenario | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const scenarios: TrainingScenario[] = [
    {
      id: 'romantic-basic',
      emoji: '💕',
      title: 'Romantic Communication',
      description: 'Practice emotional expression with your partner',
      category: 'relationship',
      difficulty: 'beginner',
      duration: 15,
      focusAreas: ['Emotional Expression', 'Active Listening', 'Vulnerability'],
      exampleConflict: '"You never seem to understand what I\'m feeling..."',
      neuralTargets: {
        stress: 'reduce',
        empathy: 'increase',
        regulation: 'increase',
        focus: 'maintain'
      },
      unlocked: true,
      completionRate: 94
    },
    {
      id: 'workplace-conflict',
      emoji: '💼',
      title: 'Professional Disagreement',
      description: 'Navigate workplace tensions with colleagues',
      category: 'workplace',
      difficulty: 'intermediate',
      duration: 20,
      focusAreas: ['Diplomatic Communication', 'Conflict Resolution', 'Professional Boundaries'],
      exampleConflict: '"Your approach to this project is completely wrong..."',
      neuralTargets: {
        stress: 'reduce',
        empathy: 'maintain',
        regulation: 'increase',
        focus: 'increase'
      },
      unlocked: true,
      completionRate: 87
    },
    {
      id: 'family-generational',
      emoji: '👨‍👩‍👧‍👦',
      title: 'Generational Gap',
      description: 'Bridge understanding across different generations',
      category: 'family',
      difficulty: 'intermediate',
      duration: 25,
      focusAreas: ['Cultural Sensitivity', 'Patience', 'Perspective Taking'],
      exampleConflict: '"You young people don\'t understand how things work..."',
      neuralTargets: {
        stress: 'reduce',
        empathy: 'increase',
        regulation: 'increase',
        focus: 'increase'
      },
      unlocked: true,
      completionRate: 76
    },
    {
      id: 'social-group',
      emoji: '👥',
      title: 'Group Dynamics',
      description: 'Manage complex social situations with multiple people',
      category: 'social',
      difficulty: 'advanced',
      duration: 30,
      focusAreas: ['Group Mediation', 'Multi-perspective Understanding', 'Leadership'],
      exampleConflict: '"Everyone has different opinions and we can\'t agree..."',
      neuralTargets: {
        stress: 'maintain',
        empathy: 'increase',
        regulation: 'increase',
        focus: 'increase'
      },
      unlocked: userLevel !== 'beginner',
      completionRate: 68
    },
    {
      id: 'crisis-intervention',
      emoji: '🚨',
      title: 'Crisis Communication',
      description: 'Handle high-stress emergency communication',
      category: 'workplace',
      difficulty: 'advanced',
      duration: 35,
      focusAreas: ['Crisis Management', 'Calm Under Pressure', 'Clear Communication'],
      exampleConflict: '"This is an emergency and we need to act now!"',
      neuralTargets: {
        stress: 'reduce',
        empathy: 'maintain',
        regulation: 'increase',
        focus: 'increase'
      },
      unlocked: userLevel === 'advanced',
      completionRate: 45
    },
    {
      id: 'negotiation-master',
      emoji: '🤝',
      title: 'Advanced Negotiation',
      description: 'Master the art of win-win negotiations',
      category: 'workplace',
      difficulty: 'advanced',
      duration: 40,
      focusAreas: ['Strategic Thinking', 'Emotional Intelligence', 'Persuasion'],
      exampleConflict: '"We need to find a solution that works for everyone..."',
      neuralTargets: {
        stress: 'maintain',
        empathy: 'increase',
        regulation: 'increase',
        focus: 'increase'
      },
      unlocked: userLevel === 'advanced',
      completionRate: 52
    }
  ];

  const categories = [
    { id: 'all', name: 'All Scenarios', emoji: '🌟' },
    { id: 'relationship', name: 'Relationships', emoji: '💕' },
    { id: 'workplace', name: 'Workplace', emoji: '💼' },
    { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { id: 'social', name: 'Social', emoji: '👥' }
  ];

  const filteredScenarios = scenarios.filter(scenario => 
    selectedCategory === 'all' || scenario.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/50';
      case 'advanced': return 'text-red-400 bg-red-400/20 border-red-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const handleScenarioClick = (scenario: TrainingScenario) => {
    if (!scenario.unlocked) return;
    
    setSelectedScenario(scenario);
    setShowDetails(true);
    trackEvent('scenario_preview', { 
      scenario_id: scenario.id,
      category: scenario.category,
      difficulty: scenario.difficulty 
    });
  };

  const handleStartScenario = () => {
    if (!selectedScenario) return;
    
    trackEvent('scenario_start', { 
      scenario_id: selectedScenario.id,
      category: selectedScenario.category,
      difficulty: selectedScenario.difficulty 
    });
    
    onScenarioSelect(selectedScenario);
    setShowDetails(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedCategory === category.id
                ? 'bg-amber-400/20 border border-amber-400/50 text-amber-400'
                : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:border-amber-400/30'
            }`}
          >
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Scenarios Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                relative overflow-hidden rounded-xl border p-6 cursor-pointer transition-all duration-300
                ${scenario.unlocked 
                  ? 'bg-slate-800/50 border-amber-400/20 hover:border-amber-400/50 hover:transform hover:scale-105' 
                  : 'bg-slate-800/30 border-slate-600/30 opacity-60 cursor-not-allowed'
                }
              `}
              onClick={() => handleScenarioClick(scenario)}
            >
              {/* Lock Overlay */}
              {!scenario.unlocked && (
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center backdrop-blur-sm z-10">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-slate-400 text-sm">
                      Requires {scenario.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'} Level
                    </p>
                  </div>
                </div>
              )}

              {/* Completion Ring */}
              {scenario.completionRate && (
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-12 relative">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-slate-600"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${scenario.completionRate * 1.26} 126`}
                        className="text-amber-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-400">
                        {scenario.completionRate}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-4">
                <div className="text-4xl">{scenario.emoji}</div>
                
                <div>
                  <h3 className="text-lg font-bold text-amber-400 mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {scenario.description}
                  </p>
                </div>

                {/* Difficulty & Duration */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
                    {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    {scenario.duration} min
                  </span>
                </div>

                {/* Focus Areas */}
                <div className="flex flex-wrap gap-1">
                  {scenario.focusAreas.slice(0, 2).map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-400/20 text-blue-400 text-xs rounded border border-blue-400/30"
                    >
                      {area}
                    </span>
                  ))}
                  {scenario.focusAreas.length > 2 && (
                    <span className="px-2 py-1 bg-slate-600/20 text-slate-400 text-xs rounded border border-slate-600/30">
                      +{scenario.focusAreas.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scenario Details Modal */}
      <AnimatePresence>
        {showDetails && selectedScenario && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-slate-800 border border-amber-400/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{selectedScenario.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-amber-400">
                      {selectedScenario.title}
                    </h2>
                    <p className="text-slate-400">
                      {selectedScenario.duration} minute session
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Description</h3>
                <p className="text-slate-300">{selectedScenario.description}</p>
              </div>

              {/* Example Conflict */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Example Scenario</h3>
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                  <p className="text-slate-300 italic">
                    "{selectedScenario.exampleConflict}"
                  </p>
                </div>
              </div>

              {/* Focus Areas */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Training Focus</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedScenario.focusAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-400/20 border border-blue-400/30 rounded-lg p-3 text-center"
                    >
                      <span className="text-blue-400 font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neural Targets */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Neural Training Goals</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedScenario.neuralTargets).map(([metric, target]) => (
                    <div key={metric} className="flex items-center justify-between bg-slate-700/50 rounded-lg p-3">
                      <span className="text-slate-300 capitalize">{metric}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        target === 'increase' ? 'bg-green-400/20 text-green-400' :
                        target === 'reduce' ? 'bg-red-400/20 text-red-400' :
                        'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {target === 'increase' ? '↗️ Increase' : 
                         target === 'reduce' ? '↘️ Reduce' : '→ Maintain'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleStartScenario}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 py-3 rounded-lg font-bold hover:scale-105 transition-transform duration-200"
                >
                  🚀 Start Training Session
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-6 py-3 bg-slate-600/50 text-slate-300 rounded-lg font-medium hover:bg-slate-600/70 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioSelector;