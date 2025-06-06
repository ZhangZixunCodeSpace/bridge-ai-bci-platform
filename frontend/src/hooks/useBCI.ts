import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  NeuralState, 
  NeuralEvent, 
  CalibrationResults, 
  BCIDataStream, 
  WebSocketMessage,
  UseBCIReturn,
  BCIConnectionError,
  CalibrationError
} from '../types';

/**
 * Custom hook for managing BCI data and real-time neural monitoring
 * 
 * Handles WebSocket connections, neural data streaming, calibration,
 * and provides real-time neural state updates for training sessions.
 */
export const useBCI = (): UseBCIReturn => {
  // State management
  const [neuralState, setNeuralState] = useState<NeuralState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [signalQuality, setSignalQuality] = useState(0);
  const [events, setEvents] = useState<NeuralEvent[]>([]);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // WebSocket connection management
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  // Neural data buffer for smoothing
  const neuralBufferRef = useRef<NeuralState[]>([]);
  const bufferSize = 5;

  /**
   * Initialize default neural state
   */
  const getDefaultNeuralState = (): NeuralState => ({
    timestamp: new Date().toISOString(),
    stress_level: 30,
    empathy_activation: 50,
    emotional_regulation: 60,
    focus_index: 70,
    neural_coherence: 0.5,
    attention_level: 65
  });

  /**
   * Smooth neural data using moving average
   */
  const smoothNeuralData = (newData: NeuralState): NeuralState => {
    neuralBufferRef.current.push(newData);
    
    if (neuralBufferRef.current.length > bufferSize) {
      neuralBufferRef.current.shift();
    }

    const buffer = neuralBufferRef.current;
    const smoothed: NeuralState = {
      timestamp: newData.timestamp,
      stress_level: buffer.reduce((sum, data) => sum + data.stress_level, 0) / buffer.length,
      empathy_activation: buffer.reduce((sum, data) => sum + data.empathy_activation, 0) / buffer.length,
      emotional_regulation: buffer.reduce((sum, data) => sum + data.emotional_regulation, 0) / buffer.length,
      focus_index: buffer.reduce((sum, data) => sum + data.focus_index, 0) / buffer.length,
      neural_coherence: buffer.reduce((sum, data) => sum + data.neural_coherence, 0) / buffer.length,
      attention_level: buffer.reduce((sum, data) => sum + data.attention_level, 0) / buffer.length
    };

    return smoothed;
  };

  /**
   * Process incoming neural data and detect events
   */
  const processNeuralData = useCallback((data: BCIDataStream) => {
    // Update signal quality
    setSignalQuality(data.signal_quality);

    // Smooth and update neural state
    const smoothedState = smoothNeuralData(data.neural_state);
    setNeuralState(smoothedState);

    // Add new events
    if (data.events && data.events.length > 0) {
      setEvents(prevEvents => {
        const newEvents = [...prevEvents, ...data.events];
        // Keep only the last 50 events to prevent memory issues
        return newEvents.slice(-50);
      });
    }

    // Log insights for debugging in development
    if (process.env.NODE_ENV === 'development' && data.insights?.length > 0) {
      console.log('Neural insights:', data.insights);
    }
  }, []);

  /**
   * Handle WebSocket messages
   */
  const handleWebSocketMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'neural_data':
          processNeuralData(message.data as BCIDataStream);
          break;
          
        case 'system_message':
          console.log('BCI System:', message.data.message);
          break;
          
        case 'error':
          console.error('BCI Error:', message.data);
          throw new BCIConnectionError(message.data.message);
          
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, [processNeuralData]);

  /**
   * Handle WebSocket connection open
   */
  const handleWebSocketOpen = useCallback(() => {
    console.log('BCI WebSocket connected');
    setIsConnected(true);
    connectionAttemptsRef.current = 0;
    
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handle WebSocket connection close
   */
  const handleWebSocketClose = useCallback(() => {
    console.log('BCI WebSocket disconnected');
    setIsConnected(false);
    setSignalQuality(0);
    
    // Attempt reconnection if not intentionally closed
    if (connectionAttemptsRef.current < maxReconnectAttempts) {
      connectionAttemptsRef.current++;
      console.log(`Attempting reconnection ${connectionAttemptsRef.current}/${maxReconnectAttempts}`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          // Reconnect with the same session ID if available
          const sessionId = wsRef.current?.url.split('/').pop();
          if (sessionId) {
            connect(sessionId);
          }
        }
      }, reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }, []);

  /**
   * Handle WebSocket errors
   */
  const handleWebSocketError = useCallback((error: Event) => {
    console.error('BCI WebSocket error:', error);
    setIsConnected(false);
  }, []);

  /**
   * Connect to BCI WebSocket stream
   */
  const connect = useCallback(async (sessionId: string): Promise<void> => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Determine WebSocket URL based on environment
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NODE_ENV === 'development' 
        ? 'localhost:9000' 
        : window.location.host;
      const wsUrl = `${protocol}//${host}/neural-stream/${sessionId}`;

      console.log('Connecting to BCI stream:', wsUrl);

      // Create new WebSocket connection
      const ws = new WebSocket(wsUrl);
      
      // Set up event handlers
      ws.addEventListener('open', handleWebSocketOpen);
      ws.addEventListener('message', handleWebSocketMessage);
      ws.addEventListener('close', handleWebSocketClose);
      ws.addEventListener('error', handleWebSocketError);
      
      wsRef.current = ws;

      // Initialize with default state
      setNeuralState(getDefaultNeuralState());
      
    } catch (error) {
      console.error('Failed to connect to BCI stream:', error);
      throw new BCIConnectionError('Failed to establish BCI connection');
    }
  }, [handleWebSocketOpen, handleWebSocketMessage, handleWebSocketClose, handleWebSocketError]);

  /**
   * Disconnect from BCI stream
   */
  const disconnect = useCallback(() => {
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close WebSocket connection
    if (wsRef.current) {
      wsRef.current.removeEventListener('open', handleWebSocketOpen);
      wsRef.current.removeEventListener('message', handleWebSocketMessage);
      wsRef.current.removeEventListener('close', handleWebSocketClose);
      wsRef.current.removeEventListener('error', handleWebSocketError);
      wsRef.current.close();
      wsRef.current = null;
    }

    // Reset state
    setIsConnected(false);
    setNeuralState(null);
    setSignalQuality(0);
    setEvents([]);
    neuralBufferRef.current = [];
    connectionAttemptsRef.current = 0;
    
    console.log('BCI disconnected');
  }, [handleWebSocketOpen, handleWebSocketMessage, handleWebSocketClose, handleWebSocketError]);

  /**
   * Perform neural calibration
   */
  const calibrate = useCallback(async (): Promise<CalibrationResults> => {
    if (!isConnected) {
      throw new CalibrationError('BCI not connected. Please connect first.');
    }

    setIsCalibrating(true);
    
    try {
      // Send calibration request through WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'start_calibration',
          timestamp: new Date().toISOString()
        }));
      }

      // Simulate calibration process (in real implementation, this would be handled by the server)
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Mock calibration results (real implementation would receive from server)
      const results: CalibrationResults = {
        success: true,
        confidence_scores: {
          stress: 0.92,
          empathy: 0.88,
          focus: 0.94,
          regulation: 0.86
        },
        neural_baselines: {
          stress_baseline: 28,
          empathy_baseline: 74,
          focus_baseline: 82,
          regulation_baseline: 68
        },
        recommendations: [
          'Excellent signal quality detected',
          'Strong neural baseline established',
          'Ready for advanced training protocols'
        ],
        next_steps: [
          'Begin with medium-difficulty scenarios',
          'Focus on empathy development exercises',
          'Schedule 15-20 minute training sessions'
        ]
      };

      console.log('Calibration completed successfully:', results);
      return results;

    } catch (error) {
      console.error('Calibration failed:', error);
      throw new CalibrationError('Neural calibration failed. Please try again.');
    } finally {
      setIsCalibrating(false);
    }
  }, [isConnected]);

  /**
   * Simulate neural data for development/demo purposes
   */
  const simulateNeuralData = useCallback(() => {
    if (!neuralState) return;

    const variation = () => (Math.random() - 0.5) * 10;
    
    const simulatedData: BCIDataStream = {
      session_id: 'demo-session',
      user_id: 'demo-user',
      neural_state: {
        timestamp: new Date().toISOString(),
        stress_level: Math.max(0, Math.min(100, neuralState.stress_level + variation())),
        empathy_activation: Math.max(0, Math.min(100, neuralState.empathy_activation + variation())),
        emotional_regulation: Math.max(0, Math.min(100, neuralState.emotional_regulation + variation())),
        focus_index: Math.max(0, Math.min(100, neuralState.focus_index + variation())),
        neural_coherence: Math.max(0, Math.min(1, neuralState.neural_coherence + variation() / 100)),
        attention_level: Math.max(0, Math.min(100, neuralState.attention_level + variation()))
      },
      brainwave_bands: {
        alpha: 12.5 + variation(),
        beta: 18.7 + variation(),
        gamma: 35.2 + variation(),
        theta: 6.8 + variation(),
        delta: 2.1 + variation()
      },
      signal_quality: Math.max(0.5, Math.min(1, signalQuality + (Math.random() - 0.5) * 0.1)),
      electrode_impedances: {},
      events: [],
      insights: [
        'Neural patterns showing increased focus',
        'Empathy networks activating during conversation',
        'Stress levels within optimal range for learning'
      ]
    };

    processNeuralData(simulatedData);
  }, [neuralState, signalQuality, processNeuralData]);

  /**
   * Start demo mode with simulated data
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isConnected) {
      const interval = setInterval(simulateNeuralData, 1000);
      return () => clearInterval(interval);
    }
  }, [isConnected, simulateNeuralData]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    neuralState,
    isConnected,
    signalQuality,
    events,
    connect,
    disconnect,
    calibrate
  };
};