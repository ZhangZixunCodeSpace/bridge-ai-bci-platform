import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBCI } from '../hooks/useBCI';
import { trackEvent } from '../services/analytics';

// Import our new components
import BCIMetrics from '../components/training/BCIMetrics';
import TrainingProgress from '../components/training/TrainingProgress';
import NeuralFeedbackPanel from '../components/training/NeuralFeedbackPanel';

const TrainingPage: React.FC = () => {
  const { isConnected, isCalibrating, connect, startCalibration } = useBCI();
  const [currentStep, setCurrentStep] = useState(1);
  const [isTrainingActive, setIsTrainingActive] = useState(false);

  const handleConnectBCI = async () => {
    trackEvent('bci_connect_attempt', { page: 'training' });
    try {
      await connect();
      trackEvent('bci_connect_success', { page: 'training' });
    } catch (error) {
      trackEvent('bci_connect_error', { page: 'training', error: String(error) });
    }
  };

  const handleStartCalibration = async () => {
    trackEvent('calibration_start', { step: currentStep });
    try {
      await startCalibration();
      setCurrentStep(2);
      trackEvent('calibration_complete', { step: currentStep });
    } catch (error) {
      trackEvent('calibration_error', { step: currentStep, error: String(error) });
    }
  };

  const handleStartTraining = () => {
    setIsTrainingActive(true);
    setCurrentStep(3);
    trackEvent('training_start', { step: currentStep });
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep || isConnected) {
      setCurrentStep(step);
      trackEvent('step_navigation', { from_step: currentStep, to_step: step });
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Training Progress */}
      <TrainingProgress
        currentStep={currentStep}
        totalSteps={4}
        onStepClick={handleStepClick}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-100 mb-4">
              Neural Communication Training
            </h1>
            <p className="text-xl text-slate-300">
              Real-time BCI feedback for enhanced communication skills
            </p>
          </div>

          {/* Main Training Interface */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - BCI Metrics */}
            <div className="space-y-6">
              <BCIMetrics size="large" />
              
              {/* BCI Connection Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-amber-400 mb-4">
                  🔌 BCI Connection
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Status:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                      <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>

                  {!isConnected ? (
                    <button
                      onClick={handleConnectBCI}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                    >
                      🧠 Connect BCI Device
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {currentStep === 1 && (
                        <button
                          onClick={handleStartCalibration}
                          disabled={isCalibrating}
                          className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCalibrating ? '🔄 Calibrating...' : '🔬 Start Calibration'}
                        </button>
                      )}
                      
                      {currentStep >= 2 && (
                        <button
                          onClick={handleStartTraining}
                          className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-slate-900 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                        >
                          ⚡ {isTrainingActive ? 'Training Active' : 'Start Training'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Center Column - Training Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Step Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-xl p-8"
              >
                {currentStep === 1 && (
                  <div className="text-center">
                    <div className="text-6xl mb-6">🔬</div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">
                      Step 1: Neural Calibration
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Establish your personal brain baseline for optimal training effectiveness.
                      This ensures the AI provides personalized feedback based on YOUR unique neural patterns.
                    </p>
                    {!isConnected ? (
                      <p className="text-orange-400">
                        Please connect your BCI device first to begin calibration.
                      </p>
                    ) : (
                      <p className="text-green-400">
                        ✅ BCI connected! Ready for neural calibration.
                      </p>
                    )}
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="text-center">
                    <div className="text-6xl mb-6">🎯</div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">
                      Step 2: Choose Your Scenario
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Select the type of communication challenge you want to practice.
                      Our AI will create a personalized training experience based on your choice.
                    </p>
                    
                    {/* Scenario Selection */}
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                      {[
                        { id: 'relationship', emoji: '💔', title: 'Romantic Relationship', desc: 'Practice emotional communication' },
                        { id: 'workplace', emoji: '💼', title: 'Workplace Tension', desc: 'Professional conflict resolution' },
                        { id: 'family', emoji: '👨‍👩‍👧‍👦', title: 'Family Dynamics', desc: 'Generational understanding' }
                      ].map((scenario) => (
                        <button
                          key={scenario.id}
                          onClick={() => handleStartTraining()}
                          className="p-4 bg-slate-700/50 border border-amber-400/30 rounded-lg hover:border-amber-400 hover:bg-amber-400/10 transition-colors duration-200 text-left"
                        >
                          <div className="text-3xl mb-2">{scenario.emoji}</div>
                          <div className="font-semibold text-amber-400 mb-1">{scenario.title}</div>
                          <div className="text-sm text-slate-400">{scenario.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="text-center">
                    <div className="text-6xl mb-6">⚡</div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">
                      Step 3: Live BCI Training
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Engage in real-time conversation training with neural feedback.
                      Watch your brain metrics and receive guidance for optimal communication.
                    </p>
                    
                    {isTrainingActive ? (
                      <div className="space-y-4">
                        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                          <p className="text-emerald-400 font-semibold">🧠 Training Session Active</p>
                          <p className="text-slate-300 text-sm mt-2">
                            Monitor your neural feedback panel for real-time insights
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            setCurrentStep(4);
                            setIsTrainingActive(false);
                            trackEvent('training_complete', { step: currentStep });
                          }}
                          className="bg-gradient-to-r from-purple-400 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                        >
                          📊 Complete Training & View Results
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-400">
                        Click "Start Training" to begin your neural communication session.
                      </p>
                    )}
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="text-center">
                    <div className="text-6xl mb-6">📊</div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">
                      Step 4: Neural Analysis Complete
                    </h2>
                    <p className="text-slate-300 mb-6">
                      Your communication neural pathways have been enhanced through BCI-guided practice!
                    </p>
                    
                    {/* Results Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8 mb-8">
                      {[
                        { label: 'Neural Connections', value: '+47', color: 'text-amber-400' },
                        { label: 'Stress Reduction', value: '-67%', color: 'text-green-400' },
                        { label: 'Empathy Increase', value: '+96%', color: 'text-blue-400' },
                        { label: 'BCI Performance', value: 'A+', color: 'text-purple-400' }
                      ].map((result, index) => (
                        <div key={index} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                          <div className={`text-2xl font-bold ${result.color} mb-1`}>
                            {result.value}
                          </div>
                          <div className="text-sm text-slate-400">{result.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-x-4">
                      <button
                        onClick={() => {
                          setCurrentStep(2);
                          setIsTrainingActive(false);
                          trackEvent('training_restart', { from_step: 4 });
                        }}
                        className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                      >
                        🔄 Train Another Scenario
                      </button>
                      
                      <a
                        href="/demo.html"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                      >
                        🎮 Try Full Demo
                      </a>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Neural Feedback Panel */}
              <NeuralFeedbackPanel />
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <a
                href="/demo.html"
                className="block bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 rounded-xl p-6 hover:border-amber-400/50 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-4">🧠</div>
                <h3 className="text-lg font-bold text-amber-400 mb-2 group-hover:text-amber-300">
                  Full Interactive Demo
                </h3>
                <p className="text-slate-300 text-sm">
                  Experience the complete 4-step neural training journey
                </p>
              </a>

              <a
                href="/dashboard"
                className="block bg-gradient-to-br from-blue-400/20 to-purple-500/20 border border-blue-400/30 rounded-xl p-6 hover:border-blue-400/50 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-bold text-blue-400 mb-2 group-hover:text-blue-300">
                  View Dashboard
                </h3>
                <p className="text-slate-300 text-sm">
                  Monitor your progress and neural development
                </p>
              </a>

              <a
                href="/"
                className="block bg-gradient-to-br from-emerald-400/20 to-emerald-500/20 border border-emerald-400/30 rounded-xl p-6 hover:border-emerald-400/50 transition-colors duration-200 group"
              >
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="text-lg font-bold text-emerald-400 mb-2 group-hover:text-emerald-300">
                  Back to Home
                </h3>
                <p className="text-slate-300 text-sm">
                  Return to the main Bridge platform
                </p>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingPage;