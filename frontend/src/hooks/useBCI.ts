import { useState, useEffect } from 'react';

interface BCIMetrics {
  stress: number;
  focus: number;
  empathy: number;
  regulation: number;
}

interface BCIData {
  metrics: BCIMetrics;
  isCalibrated: boolean;
  signalQuality: 'poor' | 'good' | 'excellent';
  timestamp: number;
}

interface BCIHookReturn {
  isConnected: boolean;
  isCalibrating: boolean;
  data: BCIData | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  startCalibration: () => Promise<void>;
  stopCalibration: () => void;
}

export const useBCI = (): BCIHookReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [data, setData] = useState<BCIData | null>(null);

  // Simulate BCI connection and data
  useEffect(() => {
    if (isConnected && !isCalibrating) {
      const interval = setInterval(() => {
        setData({
          metrics: {
            stress: Math.max(15, Math.min(35, 25 + (Math.random() - 0.5) * 10)),
            focus: Math.max(80, Math.min(95, 87 + (Math.random() - 0.5) * 10)),
            empathy: Math.max(70, Math.min(85, 76 + (Math.random() - 0.5) * 10)),
            regulation: Math.max(60, Math.min(90, 75 + (Math.random() - 0.5) * 15))
          },
          isCalibrated: true,
          signalQuality: 'excellent',
          timestamp: Date.now()
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected, isCalibrating]);

  const connect = async (): Promise<void> => {
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsConnected(true);
  };

  const disconnect = (): void => {
    setIsConnected(false);
    setData(null);
  };

  const startCalibration = async (): Promise<void> => {
    setIsCalibrating(true);
    // Simulate calibration process
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsCalibrating(false);
  };

  const stopCalibration = (): void => {
    setIsCalibrating(false);
  };

  return {
    isConnected,
    isCalibrating,
    data,
    connect,
    disconnect,
    startCalibration,
    stopCalibration
  };
};