/**
 * Bridge AI+BCI Platform - Visualization Components Index
 * 
 * Export all visualization components for easy importing
 */

export { BCIWaveform } from './BCIWaveform';
export { FrequencySpectrum } from './FrequencySpectrum';

// Re-export types for convenience
export type {
  BCIWaveformProps,
  FrequencySpectrumProps,
  WaveformConfig,
  WaveformTheme,
  EEGChannel,
  EEGSample,
  SpectrumData,
  FrequencyBand,
  SignalQuality,
  StreamStatus,
  StreamMetrics
} from '../types/waveform.types';

export {
  STANDARD_10_20_CHANNELS,
  DEFAULT_FREQUENCY_BANDS
} from '../types/waveform.types';
