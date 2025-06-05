/**
 * Bridge AI+BCI Platform - Waveform Visualization Types
 * 
 * Comprehensive type definitions for real-time EEG waveform visualization
 * Supports 32-channel EEG with frequency analysis and real-time streaming
 */

// ===== CORE EEG DATA TYPES =====

export interface EEGChannel {
  id: string;
  name: string;               // e.g., "Fp1", "Fp2", "F3", "F4"
  position: ChannelPosition;  // 3D electrode position
  impedance: number;          // Electrode impedance in kΩ
  gain: number;              // Amplification gain
  isActive: boolean;         // Channel enabled/disabled
  color: string;             // Display color
}

export interface ChannelPosition {
  x: number;    // X coordinate on scalp
  y: number;    // Y coordinate on scalp  
  z: number;    // Z coordinate (height)
  theta: number; // Spherical theta
  phi: number;   // Spherical phi
}

export interface EEGSample {
  timestamp: number;              // Unix timestamp in ms
  channelData: number[];          // Raw voltage values (32 channels)
  sampleRate: number;             // Sampling rate in Hz
  sequenceNumber: number;         // Sample sequence ID
  quality: SignalQuality;         // Signal quality metrics
}

export interface SignalQuality {
  overall: number;                // Overall quality score 0-100
  channelQualities: number[];     // Per-channel quality scores
  artifacts: ArtifactDetection;   // Detected artifacts
  impedanceStatus: ImpedanceStatus;
}

export interface ArtifactDetection {
  eyeBlink: boolean;
  muscleMovement: boolean;
  electrode: boolean;             // Electrode artifacts
  environmental: boolean;         // 50/60Hz noise
  saturation: boolean;           // Amplifier saturation
}

export interface ImpedanceStatus {
  acceptable: boolean;
  channelImpedances: number[];   // Per-channel impedance values
  maxImpedance: number;
  avgImpedance: number;
}

// ===== FREQUENCY ANALYSIS TYPES =====

export interface FrequencyBand {
  name: 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma';
  range: [number, number];       // Frequency range in Hz
  color: string;                 // Display color
  power: number;                 // Current power in this band
  normalizedPower: number;       // Normalized power 0-1
}

export interface SpectrumData {
  frequencies: number[];         // Frequency bins
  powers: number[][];           // Power values per channel per frequency
  bands: FrequencyBand[];       // Frequency band analysis
  dominantFreq: number;         // Peak frequency
  spectralCentroid: number;     // Spectral centroid
  bandwidth: number;            // Spectral bandwidth
}

// ===== DISPLAY CONFIGURATION =====

export interface WaveformConfig {
  // Time window settings
  timeWindow: number;           // Display window in seconds (1-30s)
  updateRate: number;           // Display update rate in Hz (30-60)
  
  // Channel display settings
  channelHeight: number;        // Height per channel in pixels
  channelSpacing: number;       // Spacing between channels
  visibleChannels: string[];    // List of visible channel IDs
  channelOrder: string[];       // Display order of channels
  
  // Amplitude settings
  autoGain: boolean;           // Automatic gain control
  gainMultiplier: number;      // Manual gain multiplier
  baselineCorrection: boolean; // DC offset removal
  
  // Filtering settings
  highPassFilter: number;      // High-pass cutoff in Hz
  lowPassFilter: number;       // Low-pass cutoff in Hz
  notchFilter: boolean;        // 50/60Hz notch filter
  
  // Visual settings
  backgroundColor: string;     // Background color
  gridColor: string;          // Grid line color
  showGrid: boolean;          // Show time/amplitude grid
  showLabels: boolean;        // Show channel labels
  showScale: boolean;         // Show amplitude scale
  
  // Performance settings
  bufferSize: number;         // Data buffer size in samples
  renderMode: 'canvas' | 'svg'; // Rendering mode
  antiAliasing: boolean;      // Anti-aliasing enabled
}

export interface WaveformTheme {
  primary: string;            // Primary theme color
  secondary: string;          // Secondary theme color
  background: string;         // Background color
  surface: string;           // Surface color
  text: string;              // Text color
  grid: string;              // Grid color
  channels: {
    frontal: string;         // Frontal lobe channels
    temporal: string;        // Temporal lobe channels
    parietal: string;        // Parietal lobe channels
    occipital: string;       // Occipital lobe channels
    central: string;         // Central channels
  };
}

// ===== INTERACTION TYPES =====

export interface WaveformInteraction {
  mode: 'pan' | 'zoom' | 'select' | 'measure';
  isPanning: boolean;
  isZooming: boolean;
  selection: TimeSelection | null;
  cursor: CursorInfo | null;
}

export interface TimeSelection {
  startTime: number;          // Selection start in ms
  endTime: number;            // Selection end in ms
  channels: string[];         // Selected channels
}

export interface CursorInfo {
  time: number;               // Cursor time position
  amplitude: number;          // Amplitude at cursor
  channel: string;            // Active channel
  frequency: number | null;   // Frequency if in spectrum mode
}

// ===== REAL-TIME STREAMING =====

export interface StreamConfig {
  sampleRate: number;         // Expected sample rate
  channels: number;           // Number of channels
  dataFormat: 'float32' | 'int16' | 'int32';
  byteOrder: 'little' | 'big'; // Endianness
  compressionType: 'none' | 'gzip' | 'lz4';
}

export interface StreamStatus {
  isConnected: boolean;
  isStreaming: boolean;
  dataRate: number;           // Actual data rate in Hz
  dropoutRate: number;        // Packet loss percentage
  latency: number;            // Stream latency in ms
  bufferLevel: number;        // Buffer fill level 0-1
}

export interface StreamMetrics {
  packetsReceived: number;
  packetsDropped: number;
  bytesReceived: number;
  averageLatency: number;
  jitter: number;             // Timing jitter in ms
  lastUpdate: number;         // Last update timestamp
}

// ===== ANALYSIS RESULTS =====

export interface WaveformAnalysis {
  // Statistical measures
  statistics: ChannelStatistics[];
  
  // Frequency analysis
  spectrum: SpectrumData;
  
  // Event detection
  events: DetectedEvent[];
  
  // Quality assessment
  quality: QualityAssessment;
  
  // Connectivity analysis
  connectivity: ConnectivityMatrix;
}

export interface ChannelStatistics {
  channelId: string;
  mean: number;               // Mean amplitude
  variance: number;           // Variance
  rms: number;               // RMS amplitude
  peak: number;              // Peak amplitude
  kurtosis: number;          // Distribution kurtosis
  skewness: number;          // Distribution skewness
}

export interface DetectedEvent {
  type: 'spike' | 'artifact' | 'rhythm' | 'burst';
  startTime: number;
  endTime: number;
  channels: string[];
  confidence: number;         // Detection confidence 0-1
  properties: Record<string, any>;
}

export interface QualityAssessment {
  overallScore: number;       // Overall quality 0-100
  issues: QualityIssue[];
  recommendations: string[];
}

export interface QualityIssue {
  type: 'impedance' | 'artifact' | 'saturation' | 'dropout';
  severity: 'low' | 'medium' | 'high';
  channels: string[];
  description: string;
  timestamp: number;
}

export interface ConnectivityMatrix {
  coherence: number[][];      // Channel-to-channel coherence
  phaseSync: number[][];      // Phase synchronization
  freqBand: FrequencyBand;   // Analysis frequency band
}

// ===== COMPONENT PROPS =====

export interface BCIWaveformProps {
  // Data source
  dataStream?: EEGSample[];
  channels: EEGChannel[];
  
  // Configuration
  config?: Partial<WaveformConfig>;
  theme?: Partial<WaveformTheme>;
  
  // Event handlers
  onChannelSelect?: (channelId: string) => void;
  onTimeSelect?: (selection: TimeSelection) => void;
  onConfigChange?: (config: WaveformConfig) => void;
  onAnalysisUpdate?: (analysis: WaveformAnalysis) => void;
  
  // Component state
  isLoading?: boolean;
  error?: string | null;
  
  // Advanced features
  enableFrequencyAnalysis?: boolean;
  enableEventDetection?: boolean;
  enableConnectivityAnalysis?: boolean;
  enableExport?: boolean;
}

export interface WaveformChannelProps {
  channel: EEGChannel;
  data: number[];
  timestamps: number[];
  config: WaveformConfig;
  theme: WaveformTheme;
  isSelected?: boolean;
  onSelect?: () => void;
}

export interface FrequencySpectrumProps {
  spectrumData: SpectrumData;
  config: WaveformConfig;
  theme: WaveformTheme;
  selectedBands?: string[];
  onBandSelect?: (bandName: string) => void;
}

// ===== UTILITY TYPES =====

export type ChannelGroup = 'frontal' | 'temporal' | 'parietal' | 'occipital' | 'central';
export type ViewMode = 'waveform' | 'spectrum' | 'spectrogram' | 'topographic';
export type ExportFormat = 'png' | 'svg' | 'pdf' | 'csv' | 'edf';

export interface ExportOptions {
  format: ExportFormat;
  timeRange?: [number, number];
  channels?: string[];
  resolution?: number;
  includeMetadata?: boolean;
}

// ===== STANDARD EEG CHANNEL LAYOUTS =====

export const STANDARD_10_20_CHANNELS: EEGChannel[] = [
  // Frontal
  { id: 'Fp1', name: 'Fp1', position: { x: -0.3, y: 0.9, z: 0.3, theta: 0.3, phi: 1.5 }, impedance: 0, gain: 1, isActive: true, color: '#FF6B6B' },
  { id: 'Fp2', name: 'Fp2', position: { x: 0.3, y: 0.9, z: 0.3, theta: -0.3, phi: 1.5 }, impedance: 0, gain: 1, isActive: true, color: '#FF6B6B' },
  { id: 'F3', name: 'F3', position: { x: -0.5, y: 0.7, z: 0.5, theta: 0.5, phi: 1.2 }, impedance: 0, gain: 1, isActive: true, color: '#FF8E8E' },
  { id: 'F4', name: 'F4', position: { x: 0.5, y: 0.7, z: 0.5, theta: -0.5, phi: 1.2 }, impedance: 0, gain: 1, isActive: true, color: '#FF8E8E' },
  { id: 'F7', name: 'F7', position: { x: -0.8, y: 0.6, z: 0.2, theta: 0.8, phi: 1.1 }, impedance: 0, gain: 1, isActive: true, color: '#FFB1B1' },
  { id: 'F8', name: 'F8', position: { x: 0.8, y: 0.6, z: 0.2, theta: -0.8, phi: 1.1 }, impedance: 0, gain: 1, isActive: true, color: '#FFB1B1' },
  
  // Central
  { id: 'C3', name: 'C3', position: { x: -0.6, y: 0, z: 0.8, theta: 0.6, phi: 1.57 }, impedance: 0, gain: 1, isActive: true, color: '#4ECDC4' },
  { id: 'C4', name: 'C4', position: { x: 0.6, y: 0, z: 0.8, theta: -0.6, phi: 1.57 }, impedance: 0, gain: 1, isActive: true, color: '#4ECDC4' },
  { id: 'Cz', name: 'Cz', position: { x: 0, y: 0, z: 1, theta: 0, phi: 0 }, impedance: 0, gain: 1, isActive: true, color: '#45B7B8' },
  
  // Temporal
  { id: 'T3', name: 'T3', position: { x: -1, y: 0, z: 0.3, theta: 1.57, phi: 1.3 }, impedance: 0, gain: 1, isActive: true, color: '#96CEB4' },
  { id: 'T4', name: 'T4', position: { x: 1, y: 0, z: 0.3, theta: -1.57, phi: 1.3 }, impedance: 0, gain: 1, isActive: true, color: '#96CEB4' },
  { id: 'T5', name: 'T5', position: { x: -0.8, y: -0.6, z: 0.2, theta: 2.3, phi: 1.1 }, impedance: 0, gain: 1, isActive: true, color: '#FFEAA7' },
  { id: 'T6', name: 'T6', position: { x: 0.8, y: -0.6, z: 0.2, theta: -2.3, phi: 1.1 }, impedance: 0, gain: 1, isActive: true, color: '#FFEAA7' },
  
  // Parietal
  { id: 'P3', name: 'P3', position: { x: -0.5, y: -0.7, z: 0.5, theta: 2.6, phi: 1.2 }, impedance: 0, gain: 1, isActive: true, color: '#DDA0DD' },
  { id: 'P4', name: 'P4', position: { x: 0.5, y: -0.7, z: 0.5, theta: -2.6, phi: 1.2 }, impedance: 0, gain: 1, isActive: true, color: '#DDA0DD' },
  { id: 'Pz', name: 'Pz', position: { x: 0, y: -0.7, z: 0.7, theta: 3.14, phi: 0.8 }, impedance: 0, gain: 1, isActive: true, color: '#B19CD9' },
  
  // Occipital
  { id: 'O1', name: 'O1', position: { x: -0.3, y: -0.9, z: 0.3, theta: 2.8, phi: 1.5 }, impedance: 0, gain: 1, isActive: true, color: '#74B9FF' },
  { id: 'O2', name: 'O2', position: { x: 0.3, y: -0.9, z: 0.3, theta: -2.8, phi: 1.5 }, impedance: 0, gain: 1, isActive: true, color: '#74B9FF' },
];

export const DEFAULT_FREQUENCY_BANDS: FrequencyBand[] = [
  { name: 'Delta', range: [0.5, 4], color: '#8E44AD', power: 0, normalizedPower: 0 },
  { name: 'Theta', range: [4, 8], color: '#3498DB', power: 0, normalizedPower: 0 },
  { name: 'Alpha', range: [8, 13], color: '#2ECC71', power: 0, normalizedPower: 0 },
  { name: 'Beta', range: [13, 30], color: '#F39C12', power: 0, normalizedPower: 0 },
  { name: 'Gamma', range: [30, 50], color: '#E74C3C', power: 0, normalizedPower: 0 },
];
