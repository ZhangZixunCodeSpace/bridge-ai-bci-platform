/**
 * Bridge AI+BCI Platform - Signal Processing Utilities
 * 
 * Advanced EEG signal processing algorithms for real-time analysis
 * Features: FFT, filtering, artifact detection, frequency band analysis
 */

// ===== MATHEMATICAL UTILITIES =====

export class MathUtils {
  static mean(data: number[]): number {
    return data.reduce((sum, x) => sum + x, 0) / data.length;
  }

  static variance(data: number[]): number {
    const mean = this.mean(data);
    return data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
  }

  static standardDeviation(data: number[]): number {
    return Math.sqrt(this.variance(data));
  }

  static rms(data: number[]): number {
    return Math.sqrt(data.reduce((sum, x) => sum + x * x, 0) / data.length);
  }

  static peak(data: number[]): number {
    return Math.max(...data.map(Math.abs));
  }

  static peakToPeak(data: number[]): number {
    return Math.max(...data) - Math.min(...data);
  }

  static crossCorrelation(x: number[], y: number[]): number[] {
    const result: number[] = [];
    const n = Math.min(x.length, y.length);
    
    for (let lag = -(n - 1); lag < n; lag++) {
      let sum = 0;
      let count = 0;
      
      for (let i = 0; i < n; i++) {
        const j = i + lag;
        if (j >= 0 && j < n) {
          sum += x[i] * y[j];
          count++;
        }
      }
      
      result.push(count > 0 ? sum / count : 0);
    }
    
    return result;
  }

  static coherence(x: number[], y: number[], windowSize: number = 256): number {
    // Simplified coherence calculation
    const correlation = this.crossCorrelation(x, y);
    const maxCorr = Math.max(...correlation.map(Math.abs));
    return maxCorr;
  }
}

// ===== FAST FOURIER TRANSFORM =====

export class FFT {
  private static bit_reverse(n: number, bits: number): number {
    let reversed = 0;
    for (let i = 0; i < bits; i++) {
      reversed = (reversed << 1) | (n & 1);
      n >>= 1;
    }
    return reversed;
  }

  static transform(real: number[], imag?: number[]): { real: number[], imag: number[] } {
    const N = real.length;
    const bits = Math.log2(N);
    
    if (!Number.isInteger(bits)) {
      throw new Error('Array length must be a power of 2');
    }
    
    // Initialize imaginary part if not provided
    if (!imag) {
      imag = new Array(N).fill(0);
    }
    
    // Bit-reverse permutation
    const realOut = new Array(N);
    const imagOut = new Array(N);
    
    for (let i = 0; i < N; i++) {
      const j = this.bit_reverse(i, bits);
      realOut[i] = real[j];
      imagOut[i] = imag[j];
    }
    
    // Cooley-Tukey FFT
    for (let size = 2; size <= N; size *= 2) {
      const halfsize = size / 2;
      const tablestep = N / size;
      
      for (let i = 0; i < N; i += size) {
        for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
          const thetaIndex = k;
          const theta = -2 * Math.PI * thetaIndex / N;
          const wreal = Math.cos(theta);
          const wimag = Math.sin(theta);
          
          const xreal = realOut[j + halfsize];
          const ximag = imagOut[j + halfsize];
          
          const tempReal = xreal * wreal - ximag * wimag;
          const tempImag = xreal * wimag + ximag * wreal;
          
          realOut[j + halfsize] = realOut[j] - tempReal;
          imagOut[j + halfsize] = imagOut[j] - tempImag;
          realOut[j] += tempReal;
          imagOut[j] += tempImag;
        }
      }
    }
    
    return { real: realOut, imag: imagOut };
  }

  static magnitude(real: number[], imag: number[]): number[] {
    return real.map((r, i) => Math.sqrt(r * r + imag[i] * imag[i]));
  }

  static powerSpectrum(data: number[]): number[] {
    const { real, imag } = this.transform(data);
    const magnitude = this.magnitude(real, imag);
    return magnitude.map(m => m * m);
  }

  static frequencyBins(sampleRate: number, fftSize: number): number[] {
    const bins: number[] = [];
    for (let i = 0; i < fftSize / 2; i++) {
      bins.push((i * sampleRate) / fftSize);
    }
    return bins;
  }
}

// ===== FREQUENCY ANALYSIS =====

export interface FrequencyBandPowers {
  delta: number;    // 0.5-4 Hz
  theta: number;    // 4-8 Hz
  alpha: number;    // 8-13 Hz
  beta: number;     // 13-30 Hz
  gamma: number;    // 30-50 Hz
}

export class FrequencyAnalysis {
  static computeBandPowers(data: number[], sampleRate: number): FrequencyBandPowers {
    const powerSpectrum = FFT.powerSpectrum(data);
    const frequencies = FFT.frequencyBins(sampleRate, data.length);
    
    const bands = {
      delta: { min: 0.5, max: 4 },
      theta: { min: 4, max: 8 },
      alpha: { min: 8, max: 13 },
      beta: { min: 13, max: 30 },
      gamma: { min: 30, max: 50 }
    };
    
    const bandPowers: FrequencyBandPowers = {
      delta: 0, theta: 0, alpha: 0, beta: 0, gamma: 0
    };
    
    Object.entries(bands).forEach(([bandName, range]) => {
      let power = 0;
      let count = 0;
      
      frequencies.forEach((freq, i) => {
        if (freq >= range.min && freq <= range.max) {
          power += powerSpectrum[i];
          count++;
        }
      });
      
      bandPowers[bandName as keyof FrequencyBandPowers] = count > 0 ? power / count : 0;
    });
    
    return bandPowers;
  }

  static dominantFrequency(data: number[], sampleRate: number): number {
    const powerSpectrum = FFT.powerSpectrum(data);
    const frequencies = FFT.frequencyBins(sampleRate, data.length);
    
    let maxPower = 0;
    let dominantFreq = 0;
    
    powerSpectrum.forEach((power, i) => {
      if (power > maxPower && frequencies[i] > 0.5 && frequencies[i] < 50) {
        maxPower = power;
        dominantFreq = frequencies[i];
      }
    });
    
    return dominantFreq;
  }
}

// ===== EXPORT ALL =====

export const SignalProcessing = {
  MathUtils,
  FFT,
  FrequencyAnalysis
};
