/**
 * Bridge AI+BCI Platform - Real-time EEG Waveform Visualization Component
 * 
 * High-performance 32-channel EEG waveform display with real-time streaming
 * Features: D3.js rendering, signal filtering, quality monitoring, export capabilities
 */

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BCIWaveformProps, 
  WaveformConfig, 
  WaveformTheme, 
  EEGChannel,
  StreamStatus,
  SignalQuality,
  STANDARD_10_20_CHANNELS,
  DEFAULT_FREQUENCY_BANDS 
} from '../types/waveform.types';
import { useWaveformData } from '../hooks/useWaveformData';

// ===== DEFAULT CONFIGURATIONS =====

const DEFAULT_CONFIG: WaveformConfig = {
  timeWindow: 10,              // 10 second window
  updateRate: 60,              // 60 FPS
  channelHeight: 60,           // 60px per channel
  channelSpacing: 10,          // 10px between channels
  visibleChannels: STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id), // First 8 channels
  channelOrder: STANDARD_10_20_CHANNELS.slice(0, 8).map(c => c.id),
  autoGain: true,
  gainMultiplier: 1.0,
  baselineCorrection: true,
  highPassFilter: 0.5,         // 0.5 Hz high-pass
  lowPassFilter: 50,           // 50 Hz low-pass
  notchFilter: true,           // 50/60 Hz notch
  backgroundColor: '#0F172A',
  gridColor: '#1E293B',
  showGrid: true,
  showLabels: true,
  showScale: true,
  bufferSize: 5000,            // 10 seconds at 500Hz
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

// ===== WAVEFORM RENDERER CLASS =====

class WaveformRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private config: WaveformConfig;
  private theme: WaveformTheme;
  private xScale: d3.ScaleLinear<number, number>;
  private yScales: Map<string, d3.ScaleLinear<number, number>> = new Map();

  constructor(canvas: HTMLCanvasElement, config: WaveformConfig, theme: WaveformTheme) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    this.config = config;
    this.theme = theme;
    
    // Initialize scales
    this.xScale = d3.scaleLinear();
    this.setupCanvas();
  }

  private setupCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.width = rect.width;
    this.height = rect.height;
    
    // Set actual canvas size in memory (scaled for high DPI)
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    
    // Scale the drawing context to ensure correct drawing operations
    this.context.scale(dpr, dpr);
    
    // Set canvas style size to original size
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
  }

  updateConfig(config: WaveformConfig): void {
    this.config = config;
    this.setupScales();
  }

  updateTheme(theme: WaveformTheme): void {
    this.theme = theme;
  }

  private setupScales(): void {
    const now = Date.now();
    const timeStart = now - this.config.timeWindow * 1000;
    
    // X scale for time
    this.xScale = d3.scaleLinear()
      .domain([timeStart, now])
      .range([60, this.width - 20]); // Leave space for labels
    
    // Y scales for each channel
    this.yScales.clear();
    const channelHeight = this.config.channelHeight;
    const channelSpacing = this.config.channelSpacing;
    
    this.config.visibleChannels.forEach((channelId, index) => {
      const yCenter = 40 + index * (channelHeight + channelSpacing) + channelHeight / 2;
      const yScale = d3.scaleLinear()
        .domain([-100, 100]) // μV range, will auto-adjust based on data
        .range([yCenter + channelHeight / 2, yCenter - channelHeight / 2]);
      
      this.yScales.set(channelId, yScale);
    });
  }

  render(
    channels: EEGChannel[], 
    data: number[][], 
    timestamps: number[], 
    signalQuality: SignalQuality
  ): void {
    this.setupScales();
    this.clearCanvas();
    
    if (this.config.showGrid) {
      this.drawGrid();
    }
    
    if (this.config.showLabels) {
      this.drawLabels(channels);
    }
    
    if (this.config.showScale) {
      this.drawScale();
    }
    
    this.drawWaveforms(channels, data, timestamps, signalQuality);
    this.drawQualityIndicators(signalQuality);
  }

  private clearCanvas(): void {
    this.context.fillStyle = this.config.backgroundColor;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  private drawGrid(): void {
    this.context.strokeStyle = this.config.gridColor;
    this.context.lineWidth = 0.5;
    this.context.globalAlpha = 0.3;
    
    // Vertical time grid lines (every second)
    const timeStep = 1000; // 1 second
    const domain = this.xScale.domain();
    for (let time = Math.ceil(domain[0] / timeStep) * timeStep; time <= domain[1]; time += timeStep) {
      const x = this.xScale(time);
      this.context.beginPath();
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.height);
      this.context.stroke();
    }
    
    // Horizontal channel grid lines
    this.config.visibleChannels.forEach(channelId => {
      const yScale = this.yScales.get(channelId);
      if (yScale) {
        const yCenter = (yScale.range()[0] + yScale.range()[1]) / 2;
        this.context.beginPath();
        this.context.moveTo(60, yCenter);
        this.context.lineTo(this.width - 20, yCenter);
        this.context.stroke();
      }
    });
    
    this.context.globalAlpha = 1;
  }

  private drawLabels(channels: EEGChannel[]): void {
    this.context.fillStyle = this.theme.text;
    this.context.font = '12px Inter, sans-serif';
    this.context.textAlign = 'right';
    this.context.textBaseline = 'middle';
    
    this.config.visibleChannels.forEach(channelId => {
      const channel = channels.find(c => c.id === channelId);
      const yScale = this.yScales.get(channelId);
      
      if (channel && yScale) {
        const yCenter = (yScale.range()[0] + yScale.range()[1]) / 2;
        this.context.fillStyle = channel.color;
        this.context.fillText(channel.name, 50, yCenter);
      }
    });
  }

  private drawScale(): void {
    this.context.fillStyle = this.theme.text;
    this.context.font = '10px Inter, sans-serif';
    this.context.textAlign = 'center';
    
    // Time scale at bottom
    const domain = this.xScale.domain();
    const timeStep = 1000; // 1 second
    for (let time = Math.ceil(domain[0] / timeStep) * timeStep; time <= domain[1]; time += timeStep) {
      const x = this.xScale(time);
      const secondsAgo = Math.round((Date.now() - time) / 1000);
      this.context.fillText(`-${secondsAgo}s`, x, this.height - 10);
    }
    
    // Amplitude scale on right
    this.context.textAlign = 'left';
    const firstChannelScale = this.yScales.values().next().value;
    if (firstChannelScale) {
      const amplitudes = [-50, 0, 50]; // μV
      amplitudes.forEach(amp => {
        const y = firstChannelScale(amp);
        this.context.fillText(`${amp}μV`, this.width - 15, y);
      });
    }
  }

  private drawWaveforms(
    channels: EEGChannel[], 
    data: number[][], 
    timestamps: number[], 
    signalQuality: SignalQuality
  ): void {
    this.context.lineWidth = 1.5;
    this.context.globalAlpha = 0.9;
    
    this.config.visibleChannels.forEach((channelId, channelIndex) => {
      const channel = channels.find(c => c.id === channelId);
      const channelData = data[channelIndex];
      const yScale = this.yScales.get(channelId);
      
      if (!channel || !channelData || !yScale || channelData.length === 0) return;
      
      // Set color based on signal quality
      const quality = signalQuality.channelQualities[channelIndex] || 100;
      const alpha = Math.max(0.3, quality / 100);
      this.context.globalAlpha = alpha;
      this.context.strokeStyle = channel.color;
      
      // Draw waveform line
      this.context.beginPath();
      
      for (let i = 0; i < Math.min(channelData.length, timestamps.length); i++) {
        const x = this.xScale(timestamps[i]);
        const y = yScale(channelData[i]);
        
        if (i === 0) {
          this.context.moveTo(x, y);
        } else {
          this.context.lineTo(x, y);
        }
      }
      
      this.context.stroke();
      
      // Highlight artifacts
      if (signalQuality.artifacts.eyeBlink || 
          signalQuality.artifacts.muscleMovement || 
          signalQuality.artifacts.electrode) {
        this.context.strokeStyle = '#EF4444';
        this.context.lineWidth = 3;
        this.context.globalAlpha = 0.6;
        this.context.stroke();
      }
    });
    
    this.context.globalAlpha = 1;
  }

  private drawQualityIndicators(signalQuality: SignalQuality): void {
    // Draw overall quality indicator
    const qualityColor = signalQuality.overall > 80 ? '#10B981' : 
                        signalQuality.overall > 60 ? '#F59E0B' : '#EF4444';
    
    this.context.fillStyle = qualityColor;
    this.context.fillRect(10, 10, 30, 10);
    
    this.context.fillStyle = this.theme.text;
    this.context.font = '10px Inter, sans-serif';
    this.context.textAlign = 'left';
    this.context.fillText(`Quality: ${Math.round(signalQuality.overall)}%`, 45, 18);
    
    // Draw artifact indicators
    let yOffset = 30;
    const artifacts = signalQuality.artifacts;
    
    if (artifacts.eyeBlink) {
      this.context.fillStyle = '#EF4444';
      this.context.fillText('👁️ Eye Blink', 10, yOffset);
      yOffset += 15;
    }
    
    if (artifacts.muscleMovement) {
      this.context.fillStyle = '#F59E0B';
      this.context.fillText('💪 Muscle', 10, yOffset);
      yOffset += 15;
    }
    
    if (artifacts.electrode) {
      this.context.fillStyle = '#EF4444';
      this.context.fillText('⚡ Electrode', 10, yOffset);
      yOffset += 15;
    }
  }

  resize(): void {
    this.setupCanvas();
    this.setupScales();
  }
}

// ===== MAIN COMPONENT =====

export const BCIWaveform: React.FC<BCIWaveformProps> = ({
  channels = STANDARD_10_20_CHANNELS.slice(0, 8),
  config: configProp,
  theme: themeProp,
  onChannelSelect,
  onTimeSelect,
  onConfigChange,
  onAnalysisUpdate,
  isLoading: isLoadingProp,
  error: errorProp,
  enableFrequencyAnalysis = true,
  enableEventDetection = true,
  enableConnectivityAnalysis = false,
  enableExport = true
}) => {
  // Merge with default configurations
  const config = useMemo(() => ({ ...DEFAULT_CONFIG, ...configProp }), [configProp]);
  const theme = useMemo(() => ({ ...DEFAULT_THEME, ...themeProp }), [themeProp]);
  
  // Component state
  const [isRendering, setIsRendering] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WaveformRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  
  // Data hook
  const {
    currentData,
    timestamps,
    streamStatus,
    streamMetrics,
    signalQuality,
    startStreaming,
    stopStreaming,
    clearBuffer,
    getChannelStatistics,
    exportData,
    isLoading,
    error
  } = useWaveformData({ channels, config, mockData: true });
  
  // Initialize renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new WaveformRenderer(canvasRef.current, config, theme);
    }
  }, [config, theme]);
  
  // Update renderer configuration
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.updateConfig(config);
      rendererRef.current.updateTheme(theme);
    }
  }, [config, theme]);
  
  // Rendering loop
  const renderLoop = useCallback(() => {
    if (!rendererRef.current || !streamStatus.isStreaming) return;
    
    setIsRendering(true);
    
    try {
      rendererRef.current.render(channels, currentData, timestamps, signalQuality);
    } catch (err) {
      console.error('Render error:', err);
    }
    
    setIsRendering(false);
    
    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(renderLoop);
  }, [channels, currentData, timestamps, signalQuality, streamStatus.isStreaming]);
  
  // Start rendering when streaming begins
  useEffect(() => {
    if (streamStatus.isStreaming) {
      renderLoop();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [streamStatus.isStreaming, renderLoop]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !rendererRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Determine which channel was clicked
    const channelHeight = config.channelHeight;
    const channelSpacing = config.channelSpacing;
    const clickedChannelIndex = Math.floor((y - 40) / (channelHeight + channelSpacing));
    
    if (clickedChannelIndex >= 0 && clickedChannelIndex < config.visibleChannels.length) {
      const channelId = config.visibleChannels[clickedChannelIndex];
      setSelectedChannel(channelId);
      onChannelSelect?.(channelId);
    }
  }, [config.channelHeight, config.channelSpacing, config.visibleChannels, onChannelSelect]);
  
  // Export functionality
  const handleExport = useCallback(async (format: string) => {
    try {
      const blob = await exportData(format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eeg_data_${Date.now()}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
    }
  }, [exportData]);
  
  // Loading state
  if (isLoading || isLoadingProp) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-900 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Initializing BCI connection...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || errorProp) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-900/20 rounded-lg border border-red-500/30">
        <div className="text-center text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="font-semibold">BCI Connection Error</p>
          <p className="text-sm opacity-75">{error || errorProp}</p>
          <button 
            onClick={startStreaming}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-slate-900 rounded-lg border border-slate-700 overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-white">
            🧠 Real-time EEG Waveforms
          </h3>
          
          {/* Stream Status */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              streamStatus.isStreaming 
                ? 'bg-green-400 animate-pulse' 
                : 'bg-red-400'
            }`} />
            <span className="text-sm text-slate-300">
              {streamStatus.isStreaming ? 'Streaming' : 'Disconnected'}
            </span>
          </div>
          
          {/* Data Rate */}
          {streamStatus.isStreaming && (
            <div className="text-sm text-slate-400">
              {streamStatus.dataRate} Hz
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Quality Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-full ${
              signalQuality.overall > 80 ? 'bg-green-400' :
              signalQuality.overall > 60 ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-slate-300">
              {Math.round(signalQuality.overall)}%
            </span>
          </div>
          
          {/* Controls */}
          <button
            onClick={streamStatus.isStreaming ? stopStreaming : startStreaming}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              streamStatus.isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {streamStatus.isStreaming ? '⏹️ Stop' : '▶️ Start'}
          </button>
          
          <button
            onClick={clearBuffer}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
          >
            🗑️ Clear
          </button>
          
          {enableExport && (
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              📁 Export
            </button>
          )}
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-sm transition-colors"
          >
            {isFullscreen ? '🗗' : '🗖'}
          </button>
        </div>
      </div>
      
      {/* Canvas Container */}
      <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 80px)' : '600px' }}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-crosshair"
          style={{ background: config.backgroundColor }}
        />
        
        {/* Rendering Indicator */}
        <AnimatePresence>
          {isRendering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 text-xs text-yellow-400 bg-slate-800/80 px-2 py-1 rounded"
            >
              Rendering...
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Selected Channel Info */}
        <AnimatePresence>
          {selectedChannel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 bg-slate-800/90 p-3 rounded-lg border border-slate-600"
            >
              <h4 className="font-semibold text-yellow-400 mb-2">
                Channel {selectedChannel}
              </h4>
              {(() => {
                const stats = getChannelStatistics(selectedChannel);
                return stats ? (
                  <div className="space-y-1 text-sm text-slate-300">
                    <div>RMS: {stats.rms.toFixed(1)} μV</div>
                    <div>Peak: {stats.peak.toFixed(1)} μV</div>
                    <div>Mean: {stats.mean.toFixed(1)} μV</div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400">No data</div>
                );
              })()}
              <button
                onClick={() => setSelectedChannel(null)}
                className="mt-2 text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer Stats */}
      <div className="flex items-center justify-between p-3 bg-slate-800 border-t border-slate-700 text-sm text-slate-400">
        <div className="flex items-center space-x-6">
          <span>Latency: {streamMetrics.averageLatency}ms</span>
          <span>Packets: {streamMetrics.packetsReceived}</span>
          <span>Dropped: {streamMetrics.packetsDropped}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {signalQuality.artifacts.eyeBlink && (
            <span className="text-red-400">👁️ Eye Blink</span>
          )}
          {signalQuality.artifacts.muscleMovement && (
            <span className="text-orange-400">💪 Muscle</span>
          )}
          {signalQuality.artifacts.electrode && (
            <span className="text-red-400">⚡ Electrode</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
