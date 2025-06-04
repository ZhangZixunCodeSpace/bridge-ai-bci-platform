import { useState, useEffect } from 'react';
import { trackEvent } from '../services/analytics';

interface PerformanceMetrics {
  // Timing metrics
  pageLoadTime: number;
  componentRenderTime: number;
  bciLatency: number;
  responseTime: number;

  // Memory metrics
  memoryUsage: number;
  componentCount: number;
  
  // User experience metrics
  framerate: number;
  interactionLatency: number;
  
  // BCI specific metrics
  bciDataRate: number;
  bciConnectionQuality: number;
  neuralProcessingTime: number;

  // Error tracking
  errorCount: number;
  lastError?: string;
  
  // Network metrics
  networkLatency: number;
  bandwidth: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  metric: keyof PerformanceMetrics;
  value: number;
  threshold: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    componentRenderTime: 0,
    bciLatency: 0,
    responseTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    framerate: 60,
    interactionLatency: 0,
    bciDataRate: 250, // Hz
    bciConnectionQuality: 95,
    neuralProcessingTime: 0,
    errorCount: 0,
    networkLatency: 0,
    bandwidth: 0
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Performance thresholds
  const thresholds = {
    pageLoadTime: 3000, // 3 seconds
    componentRenderTime: 16, // 16ms for 60fps
    bciLatency: 50, // 50ms
    responseTime: 200, // 200ms
    memoryUsage: 100, // 100MB
    framerate: 30, // minimum 30fps
    interactionLatency: 100, // 100ms
    bciDataRate: 200, // minimum 200Hz
    bciConnectionQuality: 80, // minimum 80%
    neuralProcessingTime: 100, // 100ms
    networkLatency: 500, // 500ms
    bandwidth: 1 // 1 Mbps minimum
  };

  // Start monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    trackEvent('performance_monitoring_start');
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    trackEvent('performance_monitoring_stop', { final_metrics: metrics });
  };

  // Measure page load time
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      setMetrics(prev => ({ ...prev, pageLoadTime: loadTime }));
    }
  }, []);

  // Monitor component render times
  const measureRenderTime = (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    const renderTime = end - start;
    
    setMetrics(prev => ({ ...prev, componentRenderTime: renderTime }));
    
    if (renderTime > thresholds.componentRenderTime) {
      addAlert({
        type: 'warning',
        message: `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`,
        metric: 'componentRenderTime',
        value: renderTime,
        threshold: thresholds.componentRenderTime
      });
    }
  };

  // Measure BCI latency
  const measureBCILatency = () => {
    const start = performance.now();
    // Simulate BCI data processing
    setTimeout(() => {
      const end = performance.now();
      const latency = end - start;
      
      setMetrics(prev => ({ ...prev, bciLatency: latency }));
      
      if (latency > thresholds.bciLatency) {
        addAlert({
          type: 'error',
          message: `High BCI latency detected: ${latency.toFixed(2)}ms`,
          metric: 'bciLatency',
          value: latency,
          threshold: thresholds.bciLatency
        });
      }
    }, 10);
  };

  // Monitor memory usage
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memoryInfo = (performance as any).memory;
        const memoryUsage = memoryInfo.usedJSHeapSize / 1024 / 1024; // Convert to MB
        
        setMetrics(prev => ({ ...prev, memoryUsage }));
        
        if (memoryUsage > thresholds.memoryUsage) {
          addAlert({
            type: 'warning',
            message: `High memory usage: ${memoryUsage.toFixed(2)}MB`,
            metric: 'memoryUsage',
            value: memoryUsage,
            threshold: thresholds.memoryUsage
          });
        }
      }

      // Simulate BCI data rate monitoring
      const bciDataRate = 240 + Math.random() * 20; // 240-260 Hz
      setMetrics(prev => ({ ...prev, bciDataRate }));

      // Simulate connection quality
      const bciConnectionQuality = 90 + Math.random() * 10; // 90-100%
      setMetrics(prev => ({ ...prev, bciConnectionQuality }));

      // Check connection quality
      if (bciConnectionQuality < thresholds.bciConnectionQuality) {
        addAlert({
          type: 'error',
          message: `Poor BCI connection quality: ${bciConnectionQuality.toFixed(1)}%`,
          metric: 'bciConnectionQuality',
          value: bciConnectionQuality,
          threshold: thresholds.bciConnectionQuality
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  // Monitor framerate
  useEffect(() => {
    if (!isMonitoring) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFramerate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        setMetrics(prev => ({ ...prev, framerate: fps }));
        
        if (fps < thresholds.framerate) {
          addAlert({
            type: 'warning',
            message: `Low framerate detected: ${fps} FPS`,
            metric: 'framerate',
            value: fps,
            threshold: thresholds.framerate
          });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      if (isMonitoring) {
        requestAnimationFrame(measureFramerate);
      }
    };

    requestAnimationFrame(measureFramerate);
  }, [isMonitoring]);

  // Add performance alert
  const addAlert = (alertData: Omit<PerformanceAlert, 'id' | 'timestamp'>) => {
    const alert: PerformanceAlert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: Date.now()
    };

    setAlerts(prev => [...prev, alert].slice(-10)); // Keep only last 10 alerts
    
    trackEvent('performance_alert', {
      type: alert.type,
      metric: alert.metric,
      value: alert.value,
      threshold: alert.threshold
    });
  };

  // Clear alerts
  const clearAlerts = () => {
    setAlerts([]);
  };

  // Get performance score (0-100)
  const getPerformanceScore = (): number => {
    const scores = {
      pageLoad: Math.max(0, 100 - (metrics.pageLoadTime / thresholds.pageLoadTime) * 100),
      renderTime: Math.max(0, 100 - (metrics.componentRenderTime / thresholds.componentRenderTime) * 100),
      bciLatency: Math.max(0, 100 - (metrics.bciLatency / thresholds.bciLatency) * 100),
      memory: Math.max(0, 100 - (metrics.memoryUsage / thresholds.memoryUsage) * 100),
      framerate: Math.min(100, (metrics.framerate / 60) * 100),
      bciQuality: metrics.bciConnectionQuality
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return Math.round(totalScore / Object.keys(scores).length);
  };

  // Measure interaction latency
  const measureInteractionLatency = (interactionType: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const latency = end - start;
      
      setMetrics(prev => ({ ...prev, interactionLatency: latency }));
      
      trackEvent('interaction_latency', {
        type: interactionType,
        latency: latency
      });
      
      if (latency > thresholds.interactionLatency) {
        addAlert({
          type: 'warning',
          message: `Slow ${interactionType} interaction: ${latency.toFixed(2)}ms`,
          metric: 'interactionLatency',
          value: latency,
          threshold: thresholds.interactionLatency
        });
      }
    };
  };

  // Export performance data
  const exportMetrics = () => {
    const data = {
      metrics,
      alerts,
      performanceScore: getPerformanceScore(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bridge-performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent('performance_data_export');
  };

  return {
    metrics,
    alerts,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    measureRenderTime,
    measureBCILatency,
    measureInteractionLatency,
    clearAlerts,
    getPerformanceScore,
    exportMetrics,
    thresholds
  };
};