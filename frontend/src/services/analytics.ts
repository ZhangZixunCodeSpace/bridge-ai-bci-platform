// Analytics service for tracking user interactions and BCI data

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class AnalyticsService {
  private isInitialized = false;

  initialize(): void {
    if (this.isInitialized) return;
    
    console.log('🔍 Bridge Analytics initialized');
    this.isInitialized = true;
    
    // Track page view
    this.track('page_view', {
      page: window.location.pathname,
      userAgent: navigator.userAgent
    });
  }

  track(event: string, properties?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized');
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      },
      timestamp: Date.now()
    };

    // In production, send to analytics service
    console.log('📊 Analytics:', analyticsEvent);
    
    // Store in local analytics queue for demo
    this.storeEvent(analyticsEvent);
  }

  trackBCIMetrics(metrics: Record<string, number>): void {
    this.track('bci_metrics', {
      ...metrics,
      type: 'neural_data'
    });
  }

  trackTrainingSession(sessionData: Record<string, any>): void {
    this.track('training_session', {
      ...sessionData,
      type: 'training_completion'
    });
  }

  trackUserInteraction(action: string, element: string): void {
    this.track('user_interaction', {
      action,
      element,
      type: 'ui_interaction'
    });
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('bridge_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('bridge_session_id', sessionId);
    }
    return sessionId;
  }

  private storeEvent(event: AnalyticsEvent): void {
    try {
      const events = JSON.parse(localStorage.getItem('bridge_analytics') || '[]');
      events.push(event);
      
      // Keep only last 100 events for demo
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('bridge_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }
  }

  getStoredEvents(): AnalyticsEvent[] {
    try {
      return JSON.parse(localStorage.getItem('bridge_analytics') || '[]');
    } catch {
      return [];
    }
  }

  clearStoredEvents(): void {
    localStorage.removeItem('bridge_analytics');
  }
}

// Create singleton instance
const analytics = new AnalyticsService();

export const initializeAnalytics = (): void => {
  analytics.initialize();
};

export const trackEvent = (event: string, properties?: Record<string, any>): void => {
  analytics.track(event, properties);
};

export const trackBCIMetrics = (metrics: Record<string, number>): void => {
  analytics.trackBCIMetrics(metrics);
};

export const trackTrainingSession = (sessionData: Record<string, any>): void => {
  analytics.trackTrainingSession(sessionData);
};

export const trackUserInteraction = (action: string, element: string): void => {
  analytics.trackUserInteraction(action, element);
};

export const getAnalyticsEvents = (): AnalyticsEvent[] => {
  return analytics.getStoredEvents();
};

export const clearAnalytics = (): void => {
  analytics.clearStoredEvents();
};

export default analytics;