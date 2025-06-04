import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Components
import ProgressBar from '../components/training/ProgressBar';
import CalibrationScreen from '../components/training/CalibrationScreen';
import ScenarioSelection from '../components/training/ScenarioSelection';
import BCITraining from '../components/training/BCITraining';
import ResultsAnalysis from '../components/training/ResultsAnalysis';
import WelcomeScreen from '../components/training/WelcomeScreen';

// Hooks and services
import { useBCI } from '../hooks/useBCI';
import { useTraining } from '../hooks/useTraining';

// Types
export interface TrainingStep {
  id: number;
  title: string;
  icon: string;
  completed: boolean;
}

export interface TrainingConfig {
  scenario: 'family' | 'relationship' | 'workplace';
  partnerStyle: 'emotional' | 'direct' | 'passive-aggressive' | 'logical';
  trainingGoal: 'stress-reduction' | 'empathy-boost' | 'emotional-regulation' | 'active-listening';
}

export interface TrainingData {
  stress: number;
  empathy: number;
  regulation: number;
  pathways: number;
  exchanges: number;
}

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, metrics, connectBCI } = useBCI();
  const { 
    currentSession, 
    startSession, 
    updateSession, 
    completeSession 
  } = useTraining();

  const [currentStep, setCurrentStep] = useState(0);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    scenario: 'relationship',
    partnerStyle: 'emotional',
    trainingGoal: 'empathy-boost',
  });
  const [trainingData, setTrainingData] = useState<TrainingData>({
    stress: 45,
    empathy: 65,
    regulation: 78,
    pathways: 0,
    exchanges: 0,
  });

  const steps: TrainingStep[] = [
    { id: 1, title: 'Neural Calibration', icon: '🔬', completed: false },
    { id: 2, title: 'Choose Scenario', icon: '🎯', completed: false },
    { id: 3, title: 'BCI Training', icon: '⚡', completed: false },
    { id: 4, title: 'Analysis', icon: '📊', completed: false },
  ];

  const [stepStates, setStepStates] = useState(steps);

  useEffect(() => {
    // Update step completion status
    setStepStates(prev => prev.map((step, index) => ({
      ...step,
      completed: index < currentStep,
    })));
  }, [currentStep]);

  const handleStepComplete = (step: number) => {
    if (step === 1 && !isCalibrated) {
      setIsCalibrated(true);
    }
    
    if (step < 4) {
      setCurrentStep(step + 1);
    }
  };

  const handleCalibrationComplete = () => {
    setIsCalibrated(true);
    handleStepComplete(1);
  };

  const handleScenarioComplete = (config: TrainingConfig) => {
    setTrainingConfig(config);
    handleStepComplete(2);
  };

  const handleTrainingComplete = (data: TrainingData) => {
    setTrainingData(data);
    handleStepComplete(3);
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setIsCalibrated(false);
    setTrainingData({
      stress: 45,
      empathy: 65,
      regulation: 78,
      pathways: 0,
      exchanges: 0,
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderCurrentScreen = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeScreen
            onStart={() => setCurrentStep(1)}
            onGoHome={handleGoHome}
          />
        );
      case 1:
        return (
          <CalibrationScreen
            isConnected={isConnected}
            metrics={metrics}
            onCalibrationComplete={handleCalibrationComplete}
            onConnect={connectBCI}
          />
        );
      case 2:
        return (
          <ScenarioSelection
            config={trainingConfig}
            onConfigChange={setTrainingConfig}
            onComplete={handleScenarioComplete}
            neuralProfile={{
              stress: metrics.stress,
              focus: metrics.focus,
              empathy: metrics.empathy,
            }}
          />
        );
      case 3:
        return (
          <BCITraining
            config={trainingConfig}
            metrics={metrics}
            onDataUpdate={setTrainingData}
            onComplete={handleTrainingComplete}
            trainingData={trainingData}
          />
        );
      case 4:
        return (
          <ResultsAnalysis
            trainingData={trainingData}
            config={trainingConfig}
            onStartNew={handleStartOver}
            onGoHome={handleGoHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative"
    >
      {/* Starry background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#fbbf24_1px,_transparent_2px),radial-gradient(circle_at_80%_20%,_#f59e0b_1px,_transparent_2px),radial-gradient(circle_at_60%_80%,_#fbbf24_1px,_transparent_2px)] bg-[length:200px_200px,250px_250px,180px_180px] animate-pulse opacity-80" />
      </div>

      {/* Main container */}
      <div className="relative z-10 max-w-6xl mx-auto min-h-screen bg-slate-900/15 backdrop-blur-xl border-l border-r border-amber-400/20">
        {/* Header */}
        <header className="bg-slate-900/90 backdrop-blur-sm border-b border-amber-400/30 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={handleGoHome}
                className="cursor-pointer flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-lg">B</span>
                </div>
                <span className="text-2xl font-bold text-amber-400">Bridge</span>
              </motion.div>
              <div className="bg-amber-400/20 text-amber-400 px-3 py-1 rounded-full text-sm border border-amber-400/30">
                AI+BCI Neural Communication
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-amber-400/10 rounded-full px-4 py-2 border border-amber-400/30">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-400 text-sm font-medium">
                {currentStep === 0 ? 'Ready to Begin' : 
                 currentStep === 1 ? 'Neural Calibration' :
                 currentStep === 2 ? 'Choose Scenario' :
                 currentStep === 3 ? 'BCI Training' : 'Analysis Complete'}
              </span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        {currentStep > 0 && (
          <ProgressBar 
            steps={stepStates}
            currentStep={currentStep}
          />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
};

export default TrainingPage;