/**
 * Bridge AI+BCI Platform - Frequency Spectrum Analysis Component
 * 
 * Real-time frequency analysis with interactive band selection
 * Features: FFT spectrum, band power visualization, dominant frequency tracking
 */

import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FrequencySpectrumProps, 
  FrequencyBand, 
  DEFAULT_FREQUENCY_BANDS,
  EEGChannel 
} from '../types/waveform.types';

// ===== SPECTRUM RENDERER CLASS =====

class SpectrumRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private xScale: d3.ScaleLinear<number, number>;
  private yScale: d3.ScaleLinear<number, number>;
  private colorScale: d3.ScaleOrdinal<string, string>;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    
    // Initialize scales
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.colorScale = d3.scaleOrdinal<string, string>()
      .domain(['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'])
      .range(['#8E44AD', '#3498DB', '#2ECC71', '#F39C12', '#E74C3C']);
    
    this.setupCanvas();
  }

  private setupCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.width = rect.width;
    this.height = rect.height;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.context.scale(dpr, dpr);
    
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
  }

  private setupScales(frequencies: number[], powers: number[]): void {
    // X scale for frequency
    this.xScale = d3.scaleLinear()
      .domain([0, Math.min(50, Math.max(...frequencies))])
      .range([60, this.width - 40]);
    
    // Y scale for power (log scale for better visualization)
    const maxPower = Math.max(...powers);
    this.yScale = d3.scaleLog()
      .domain([Math.max(0.001, Math.min(...powers.filter(p => p > 0))), maxPower])
      .range([this.height - 40, 40]);
  }

  render(
    frequencies: number[], 
    powers: number[], 
    bands: FrequencyBand[], 
    selectedBands: string[] = [],
    dominantFreq: number = 0
  ): void {
    this.setupScales(frequencies, powers);
    this.clearCanvas();
    
    this.drawGrid();
    this.drawSpectrum(frequencies, powers);
    this.drawFrequencyBands(bands, selectedBands);
    this.drawDominantFrequency(dominantFreq);
    this.drawAxes(frequencies, powers);
  }

  private clearCanvas(): void {
    this.context.fillStyle = '#0F172A';
    this.context.fillRect(0, 0, this.width, this.height);
  }

  private drawGrid(): void {
    this.context.strokeStyle = '#1E293B';
    this.context.lineWidth = 0.5;
    this.context.globalAlpha = 0.5;
    
    // Vertical frequency grid lines
    const freqStep = 5; // 5Hz steps
    for (let freq = 0; freq <= 50; freq += freqStep) {
      const x = this.xScale(freq);
      this.context.beginPath();
      this.context.moveTo(x, 40);
      this.context.lineTo(x, this.height - 40);
      this.context.stroke();
    }
    
    // Horizontal power grid lines (log scale)
    const powerSteps = [0.001, 0.01, 0.1, 1, 10, 100, 1000];
    powerSteps.forEach(power => {
      if (power >= this.yScale.domain()[0] && power <= this.yScale.domain()[1]) {
        const y = this.yScale(power);
        this.context.beginPath();
        this.context.moveTo(60, y);
        this.context.lineTo(this.width - 40, y);
        this.context.stroke();
      }
    });
    
    this.context.globalAlpha = 1;
  }

  private drawSpectrum(frequencies: number[], powers: number[]): void {
    this.context.strokeStyle = '#FBBF24';
    this.context.fillStyle = 'rgba(251, 191, 36, 0.2)';
    this.context.lineWidth = 2;
    
    // Draw spectrum line
    this.context.beginPath();
    let firstPoint = true;
    
    for (let i = 0; i < frequencies.length && frequencies[i] <= 50; i++) {
      const x = this.xScale(frequencies[i]);
      const y = this.yScale(Math.max(0.001, powers[i]));
      
      if (firstPoint) {
        this.context.moveTo(x, y);
        firstPoint = false;
      } else {
        this.context.lineTo(x, y);
      }
    }
    
    this.context.stroke();
    
    // Fill area under curve
    this.context.globalAlpha = 0.3;
    for (let i = 0; i < frequencies.length && frequencies[i] <= 50; i++) {
      const x = this.xScale(frequencies[i]);
      const y = this.yScale(Math.max(0.001, powers[i]));
      
      if (i === 0) {
        this.context.moveTo(x, this.height - 40);
        this.context.lineTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }
    }
    
    const lastX = this.xScale(Math.min(50, frequencies[frequencies.length - 1]));
    this.context.lineTo(lastX, this.height - 40);
    this.context.closePath();
    this.context.fill();
    this.context.globalAlpha = 1;
  }

  private drawFrequencyBands(bands: FrequencyBand[], selectedBands: string[]): void {
    bands.forEach(band => {
      const isSelected = selectedBands.includes(band.name);
      const alpha = isSelected ? 0.4 : 0.2;
      
      this.context.fillStyle = band.color;
      this.context.globalAlpha = alpha;
      
      const x1 = this.xScale(band.range[0]);
      const x2 = this.xScale(band.range[1]);
      const width = x2 - x1;
      
      this.context.fillRect(x1, 40, width, this.height - 80);
      
      // Band label
      this.context.globalAlpha = 1;
      this.context.fillStyle = band.color;
      this.context.font = '12px Inter, sans-serif';
      this.context.textAlign = 'center';
      this.context.fillText(
        band.name, 
        x1 + width / 2, 
        this.height - 50
      );
      
      // Power value
      this.context.font = '10px Inter, sans-serif';
      this.context.fillText(
        `${band.normalizedPower.toFixed(2)}`, 
        x1 + width / 2, 
        this.height - 35
      );
    });
    
    this.context.globalAlpha = 1;
  }

  private drawDominantFrequency(dominantFreq: number): void {
    if (dominantFreq <= 0 || dominantFreq > 50) return;
    
    const x = this.xScale(dominantFreq);
    
    this.context.strokeStyle = '#EF4444';
    this.context.lineWidth = 2;
    this.context.setLineDash([5, 5]);
    
    this.context.beginPath();
    this.context.moveTo(x, 40);
    this.context.lineTo(x, this.height - 40);
    this.context.stroke();
    
    this.context.setLineDash([]);
    
    // Label
    this.context.fillStyle = '#EF4444';
    this.context.font = '12px Inter, sans-serif';
    this.context.textAlign = 'center';
    this.context.fillText(`${dominantFreq.toFixed(1)}Hz`, x, 30);
  }

  private drawAxes(frequencies: number[], powers: number[]): void {
    this.context.strokeStyle = '#64748B';
    this.context.lineWidth = 1;
    
    // X axis
    this.context.beginPath();
    this.context.moveTo(60, this.height - 40);
    this.context.lineTo(this.width - 40, this.height - 40);
    this.context.stroke();
    
    // Y axis
    this.context.beginPath();
    this.context.moveTo(60, 40);
    this.context.lineTo(60, this.height - 40);
    this.context.stroke();
    
    // Axis labels
    this.context.fillStyle = '#94A3B8';
    this.context.font = '12px Inter, sans-serif';
    this.context.textAlign = 'center';
    
    // X axis label
    this.context.fillText('Frequency (Hz)', this.width / 2, this.height - 10);
    
    // Y axis label (rotated)
    this.context.save();
    this.context.translate(20, this.height / 2);
    this.context.rotate(-Math.PI / 2);
    this.context.fillText('Power (μV²)', 0, 0);
    this.context.restore();
    
    // Tick marks and labels
    this.context.textAlign = 'center';
    this.context.font = '10px Inter, sans-serif';
    
    // X axis ticks
    for (let freq = 0; freq <= 50; freq += 10) {
      const x = this.xScale(freq);
      this.context.fillText(freq.toString(), x, this.height - 25);
    }
    
    // Y axis ticks
    const powerSteps = [0.01, 0.1, 1, 10, 100];
    this.context.textAlign = 'right';
    powerSteps.forEach(power => {
      if (power >= this.yScale.domain()[0] && power <= this.yScale.domain()[1]) {
        const y = this.yScale(power);
        this.context.fillText(power.toString(), 55, y + 3);
      }
    });
  }

  resize(): void {
    this.setupCanvas();
  }
}

// ===== FREQUENCY SPECTRUM COMPONENT =====

export const FrequencySpectrum: React.FC<FrequencySpectrumProps> = ({
  spectrumData,
  config,
  theme,
  selectedBands = [],
  onBandSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SpectrumRenderer | null>(null);
  const animationFrameRef = useRef<number>();
  
  const [hoveredBand, setHoveredBand] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize renderer
  useEffect(() => {
    if (canvasRef.current && !rendererRef.current) {
      rendererRef.current = new SpectrumRenderer(canvasRef.current);
    }
  }, []);

  // Render spectrum
  useEffect(() => {
    if (!rendererRef.current || !spectrumData) return;
    
    setIsAnalyzing(true);
    
    const renderFrame = () => {
      if (rendererRef.current && spectrumData) {
        rendererRef.current.render(
          spectrumData.frequencies,
          spectrumData.powers[0] || [], // Use first channel for now
          spectrumData.bands,
          selectedBands,
          spectrumData.dominantFreq
        );
      }
      setIsAnalyzing(false);
    };
    
    animationFrameRef.current = requestAnimationFrame(renderFrame);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [spectrumData, selectedBands]);

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

  // Canvas click handler for band selection
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !spectrumData) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    
    // Convert click position to frequency
    const frequency = ((x - 60) / (canvasRef.current.width - 100)) * 50;
    
    // Find which band this frequency belongs to
    const clickedBand = spectrumData.bands.find(band => 
      frequency >= band.range[0] && frequency <= band.range[1]
    );
    
    if (clickedBand && onBandSelect) {
      onBandSelect(clickedBand.name);
    }
  }, [spectrumData, onBandSelect]);

  // Band statistics
  const bandStats = useMemo(() => {
    if (!spectrumData) return null;
    
    const totalPower = spectrumData.bands.reduce((sum, band) => sum + band.power, 0);
    const maxBand = spectrumData.bands.reduce((max, band) => 
      band.power > max.power ? band : max
    );
    
    return {
      totalPower,
      dominantBand: maxBand,
      alphaRatio: spectrumData.bands.find(b => b.name === 'Alpha')?.normalizedPower || 0,
      betaRatio: spectrumData.bands.find(b => b.name === 'Beta')?.normalizedPower || 0
    };
  }, [spectrumData]);

  if (!spectrumData) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-900 rounded-lg">
        <div className="text-center text-slate-400">
          <div className="text-2xl mb-2">📊</div>
          <p>No spectrum data available</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-white">
            📊 Frequency Spectrum Analysis
          </h3>
          
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Analyzing...</span>
            </div>
          )}
        </div>
        
        {bandStats && (
          <div className="flex items-center space-x-4 text-sm text-slate-300">
            <span>Dominant: {bandStats.dominantBand.name}</span>
            <span>α/β: {(bandStats.alphaRatio / Math.max(0.001, bandStats.betaRatio)).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-64 cursor-pointer"
          width={600}
          height={256}
        />
        
        {/* Analysis indicator */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 text-xs text-yellow-400 bg-slate-800/80 px-2 py-1 rounded"
            >
              FFT Processing...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Band Power Cards */}
      <div className="p-4 bg-slate-800/50">
        <div className="grid grid-cols-5 gap-3">
          {spectrumData.bands.map((band) => (
            <motion.div
              key={band.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onBandSelect?.(band.name)}
              onMouseEnter={() => setHoveredBand(band.name)}
              onMouseLeave={() => setHoveredBand(null)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedBands.includes(band.name)
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
              }`}
            >
              <div className="text-center">
                <div 
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: band.color }}
                />
                <div className="text-sm font-semibold text-white mb-1">
                  {band.name}
                </div>
                <div className="text-xs text-slate-400 mb-2">
                  {band.range[0]}-{band.range[1]} Hz
                </div>
                <div className="text-sm font-mono text-yellow-400">
                  {(band.normalizedPower * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-slate-500">
                  {band.power.toFixed(2)} μV²
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Stats */}
      {bandStats && (
        <div className="p-4 bg-slate-800 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400">Dominant Frequency</div>
              <div className="text-yellow-400 font-semibold">
                {spectrumData.dominantFreq.toFixed(1)} Hz
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-slate-400">Spectral Centroid</div>
              <div className="text-blue-400 font-semibold">
                {spectrumData.spectralCentroid.toFixed(1)} Hz
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-slate-400">Bandwidth</div>
              <div className="text-green-400 font-semibold">
                {spectrumData.bandwidth.toFixed(1)} Hz
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-slate-400">Total Power</div>
              <div className="text-purple-400 font-semibold">
                {bandStats.totalPower.toFixed(2)} μV²
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hovered Band Info */}
      <AnimatePresence>
        {hoveredBand && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 bg-slate-800/90 p-3 rounded-lg border border-slate-600"
          >
            {(() => {
              const band = spectrumData.bands.find(b => b.name === hoveredBand);
              if (!band) return null;
              
              const descriptions = {
                Delta: 'Deep sleep, unconscious processes',
                Theta: 'REM sleep, creativity, meditation',
                Alpha: 'Relaxed awareness, calm focus',
                Beta: 'Active thinking, concentration',
                Gamma: 'Binding consciousness, high attention'
              };
              
              return (
                <div>
                  <div className="font-semibold text-white mb-1">
                    {band.name} Wave ({band.range[0]}-{band.range[1]} Hz)
                  </div>
                  <div className="text-sm text-slate-300 mb-2">
                    {descriptions[band.name]}
                  </div>
                  <div className="text-xs text-slate-400">
                    Power: {band.power.toFixed(2)} μV² ({(band.normalizedPower * 100).toFixed(1)}%)
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
