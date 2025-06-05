/**
 * Bridge AI+BCI Platform - BCI Visualization Demo Page
 * 
 * Complete demonstration of the BCI waveform visualization system
 * Shows real-time EEG monitoring with frequency analysis
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BCIWaveform } from '../components/visualization/BCIWaveform';
import { FrequencySpectrum } from '../components/visualization/FrequencySpectrum';
import { 
  STANDARD_10_20_CHANNELS, 
  DEFAULT_FREQUENCY_BANDS,
  WaveformConfig,
  WaveformTheme,
  SpectrumData 
} from '../types/waveform.types';

// ===== DEFAULT CONFIGURATIONS =====

const DEFAULT_CONFIG: WaveformConfig = {
  timeWindow: 10,
  updateRate: 60,
  channelHeight: 60,
  channelSpacing: 10,
  visibleChannels: STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id),
  channelOrder: STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id),
  autoGain: true,
  gainMultiplier: 1.0,
  baselineCorrection: true,
  highPassFilter: 0.5,
  lowPassFilter: 50,
  notchFilter: true,
  backgroundColor: '#0F172A',
  gridColor: '#1E293B',
  showGrid: true,
  showLabels: true,
  showScale: true,
  bufferSize: 5000,
  renderMode: 'canvas',
  antiAliasing: true
};

const DEFAULT_THEME: WaveformTheme = {
  primary: '#FBBF24',
  secondary: '#F59E0B',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  grid: '#334155',
  channels: {
    frontal: '#FF6B6B',
    temporal: '#4ECDC4',
    parietal: '#45B7B8',
    occipital: '#96CEB4',
    central: '#FFEAA7'
  }
};

// ===== MAIN COMPONENT =====

export const BCIVisualizationDemo: React.FC = () => {
  const [config, setConfig] = useState<WaveformConfig>(DEFAULT_CONFIG);
  const [theme, setTheme] = useState<WaveformTheme>(DEFAULT_THEME);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id)
  );
  const [selectedBands, setSelectedBands] = useState<string[]>(['Alpha']);
  const [mockSpectrumData, setMockSpectrumData] = useState<SpectrumData | null>(null);

  // Generate mock spectrum data
  useEffect(() => {
    const generateMockSpectrum = () => {
      const frequencies = Array.from({length: 100}, (_, i) => i * 0.5);
      const powers = frequencies.map(freq => {
        // Generate realistic EEG power spectrum
        let power = 100 / (1 + freq); // 1/f noise
        
        // Add frequency band peaks
        if (freq >= 8 && freq <= 13) power *= 3; // Alpha peak
        if (freq >= 15 && freq <= 25) power *= 1.5; // Beta peak
        if (freq >= 1 && freq <= 4) power *= 2; // Delta peak
        
        return power + Math.random() * 10;
      });
      
      // Update band powers based on generated spectrum
      const updatedBands = DEFAULT_FREQUENCY_BANDS.map(band => {
        const bandFreqs = frequencies.filter(f => f >= band.range[0] && f <= band.range[1]);
        const bandPowers = bandFreqs.map(f => powers[frequencies.indexOf(f)]);
        const avgPower = bandPowers.reduce((sum, p) => sum + p, 0) / bandPowers.length;
        
        return {
          ...band,
          power: avgPower,
          normalizedPower: Math.random() * 0.4 + 0.1 // Mock normalized power
        };
      });
      
      setMockSpectrumData({
        frequencies,
        powers: [powers], // Single channel for demo
        bands: updatedBands,
        dominantFreq: 10.5 + Math.random() * 2,
        spectralCentroid: 12.3 + Math.random(),
        bandwidth: 8.7 + Math.random()
      });
    };

    generateMockSpectrum();
    const interval = setInterval(generateMockSpectrum, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleBandSelect = (bandName: string) => {
    setSelectedBands(prev => 
      prev.includes(bandName)
        ? prev.filter(name => name !== bandName)
        : [...prev, bandName]
    );
  };

  const handleConfigChange = (newConfig: Partial<WaveformConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleExport = (format: string) => {
    console.log('Exporting as:', format);
    // Mock export functionality
    alert(`Exporting EEG data as ${format.toUpperCase()} format...`);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setTheme(DEFAULT_THEME);
    setSelectedChannels(STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id));
    setSelectedBands(['Alpha']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600 mb-4">
            🧠 Bridge BCI Visualization
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Real-time EEG monitoring with advanced neural signal processing
          </p>
          <p className="text-slate-400">
            Powered by AI+BCI technology for communication training
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-green-400">95.2%</div>
            <div className="text-sm text-slate-400">Signal Quality</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">500Hz</div>
            <div className="text-sm text-slate-400">Sample Rate</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-yellow-400">12ms</div>
            <div className="text-sm text-slate-400">Latency</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 text-center border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">{selectedChannels.length}</div>
            <div className="text-sm text-slate-400">Active Channels</div>
          </div>
        </motion.div>

        {/* Main Waveform Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <BCIWaveform
            channels={STANDARD_10_20_CHANNELS.filter(c => 
              selectedChannels.includes(c.id)
            )}
            config={config}
            theme={theme}
            onChannelSelect={(channelId) => console.log('Selected channel:', channelId)}
            onConfigChange={handleConfigChange}
            enableFrequencyAnalysis
            enableEventDetection
            enableExport
          />
        </motion.div>

        {/* Secondary Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Frequency Spectrum */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {mockSpectrumData && (
              <FrequencySpectrum
                spectrumData={mockSpectrumData}
                config={config}
                theme={theme}
                selectedBands={selectedBands}
                onBandSelect={handleBandSelect}
              />
            )}
          </motion.div>
          
          {/* Channel Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900 rounded-lg border border-slate-700 p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              📊 Channel Management
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Active Channels</span>
                <span className="text-yellow-400 font-semibold">
                  {selectedChannels.length}/{STANDARD_10_20_CHANNELS.length}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {STANDARD_10_20_CHANNELS.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelToggle(channel.id)}
                    className={`p-2 rounded text-sm font-medium transition-all ${
                      selectedChannels.includes(channel.id)
                        ? 'bg-yellow-400 text-slate-900'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {channel.name}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedChannels(STANDARD_10_20_CHANNELS.map(c => c.id))}
                  className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  All On
                </button>
                <button
                  onClick={() => setSelectedChannels([])}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  All Off
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-slate-900 rounded-lg border border-slate-700 p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            ⚙️ Quick Controls
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Time Window</label>
              <select
                value={config.timeWindow}
                onChange={(e) => handleConfigChange({ timeWindow: Number(e.target.value) })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Gain</label>
              <select
                value={config.gainMultiplier}
                onChange={(e) => handleConfigChange({ gainMultiplier: Number(e.target.value) })}
                className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
              >
                <option value={0.5}>0.5x</option>
                <option value={1.0}>1.0x</option>
                <option value={2.0}>2.0x</option>
                <option value={5.0}>5.0x</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Actions</label>
              <div className="space-y-1">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  📁 Export CSV
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-300">System</label>
              <div className="space-y-1">
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-slate-400 text-sm"
        >
          <p>
            Bridge AI+BCI Platform © 2025 | Transforming human communication through neuroscience
          </p>
          <p className="mt-1">
            🧠 Neural data is simulated for demonstration purposes
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BCIVisualizationDemo;
