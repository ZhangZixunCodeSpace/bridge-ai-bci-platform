// Bridge AI+BCI Platform - Core Type Definitions
// Neural training and BCI data types for TypeScript

/**
 * Core neural data types
 */
export interface NeuralState {
  timestamp: string;
  stress_level: number; // 0-100
  empathy_activation: number; // 0-100
  emotional_regulation: number; // 0-100
  focus_index: number; // 0-100
  neural_coherence: number; // 0-1
  attention_level: number; // 0-100
}

export interface BCIMetrics {
  stress: number;
  empathy: number;
  focus: number;
  regulation: number;
  coherence: number;
  quality_score: number;
}

export interface BrainwaveBands {
  alpha: number;
  beta: number;
  gamma: number;
  theta: number;
  delta: number;
}

export interface NeuralEvent {
  type: 'stress_threshold' | 'empathy_spike' | 'attention_drop' | 'regulation_improvement';
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'positive';
  message: string;
  recommendation?: string;
  confidence: number;
}

/**
 * Training session types
 */
export interface TrainingSession {
  id: string;
  user_id: string;
  scenario_type: 'relationship' | 'workplace' | 'family';
  ai_partner_config: AIPartnerConfig;
  status: 'initializing' | 'calibrating' | 'active' | 'completed' | 'error';
  created_at: string;
  updated_at: string;
  duration_minutes?: number;
  neural_goals: NeuralTrainingGoals;
}

export interface AIPartnerConfig {
  personality: 'emotional' | 'direct' | 'passive_aggressive' | 'logical';
  conflict_intensity: 'low' | 'medium' | 'high';
  empathy_receptiveness: number; // 0-10
  escalation_tendency: number; // 0-10
  background_story?: string;
  trigger_phrases?: string[];
}

export interface NeuralTrainingGoals {
  stress_reduction_target: number;
  empathy_increase_target: number;
  regulation_improvement_target: number;
  focus_areas: string[];
}

/**
 * Conversation and interaction types
 */
export interface ConversationMessage {
  id: string;
  session_id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  response_type?: 'empathetic' | 'defensive' | 'neutral' | 'assertive';
  neural_state_at_response?: NeuralState;
  ai_analysis?: AIResponseAnalysis;
}

export interface AIResponseAnalysis {
  empathy_score: number; // 0-100
  emotional_tone: string;
  conflict_escalation_change: number; // -10 to +10
  coaching_feedback: string;
  suggested_improvements: string[];
  neural_impact_prediction: {
    stress_change: number;
    empathy_change: number;
    regulation_change: number;
  };
}

export interface ResponseOption {
  id: string;
  content: string;
  type: 'empathetic' | 'defensive' | 'neutral' | 'assertive';
  predicted_neural_impact: {
    stress: number;
    empathy: number;
    regulation: number;
  };
  coaching_note?: string;
}

/**
 * User and progress types
 */
export interface User {
  id: string;
  email: string;
  created_at: string;
  neural_profile?: NeuralProfile;
  subscription: Subscription;
  preferences: UserPreferences;
}

export interface NeuralProfile {
  calibrated: boolean;
  baseline_stress: number;
  baseline_empathy: number;
  baseline_focus: number;
  baseline_regulation: number;
  calibration_date?: string;
  neural_learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  optimal_training_duration: number; // minutes
  stress_triggers: string[];
  empathy_strengths: string[];
}

export interface Subscription {
  tier: 'basic' | 'pro' | 'premium' | 'enterprise';
  status: 'active' | 'canceled' | 'expired';
  bci_sessions_remaining: number;
  bci_enabled: boolean;
  expires_at: string;
}

export interface UserPreferences {
  communication_goals: string[];
  preferred_scenarios: string[];
  difficulty_preference: 'easy' | 'medium' | 'hard' | 'adaptive';
  feedback_style: 'gentle' | 'direct' | 'detailed' | 'minimal';
  training_reminders: boolean;
  data_sharing_consent: boolean;
}

/**
 * Analytics and progress types
 */
export interface ProgressAnalytics {
  period: '7d' | '30d' | '90d' | '1y';
  neural_improvements: {
    stress_reduction_percentage: number;
    empathy_increase_percentage: number;
    regulation_improvement_percentage: number;
    focus_improvement_percentage: number;
  };
  session_statistics: {
    total_sessions: number;
    average_duration: number;
    completion_rate: number;
    favorite_scenarios: string[];
  };
  neural_pathways: {
    new_connections_formed: number;
    strengthened_existing: number;
    neuroplasticity_score: number; // 0-1
  };
  skill_development: {
    empathetic_responses_percentage: number;
    conflict_resolution_success_rate: number;
    emotional_regulation_consistency: number;
  };
}

export interface TrainingReport {
  session_id: string;
  duration_minutes: number;
  conversation_exchanges: number;
  neural_state_changes: {
    stress_change: number;
    empathy_change: number;
    regulation_change: number;
    focus_change: number;
  };
  conversation_analysis: {
    empathetic_responses: number;
    defensive_responses: number;
    neutral_responses: number;
    overall_communication_score: number; // 0-100
  };
  neural_events: NeuralEvent[];
  breakthrough_moments: BreakthroughMoment[];
  recommendations: TrainingRecommendation[];
  next_session_suggestions: string[];
}

export interface BreakthroughMoment {
  timestamp: string;
  type: 'empathy_surge' | 'stress_mastery' | 'regulation_success' | 'insight_moment';
  description: string;
  neural_signature: string;
  significance_score: number; // 0-10
}

export interface TrainingRecommendation {
  category: 'scenario' | 'difficulty' | 'focus_area' | 'technique';
  title: string;
  description: string;
  reasoning: string;
  expected_benefit: string;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Real-time data streaming types
 */
export interface BCIDataStream {
  session_id: string;
  user_id: string;
  neural_state: NeuralState;
  brainwave_bands: BrainwaveBands;
  signal_quality: number; // 0-1
  electrode_impedances: Record<string, number>;
  events: NeuralEvent[];
  insights: string[];
}

export interface WebSocketMessage {
  type: 'neural_data' | 'ai_response' | 'system_message' | 'error';
  data: any;
  timestamp: string;
}

/**
 * Calibration types
 */
export interface CalibrationSession {
  id: string;
  user_id: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  duration_minutes: number;
  started_at?: string;
  completed_at?: string;
  signal_quality_scores: number[];
  baseline_measurements?: {
    rest_state: NeuralState;
    stress_state: NeuralState;
    empathy_state: NeuralState;
    focus_state: NeuralState;
  };
  calibration_results?: CalibrationResults;
}

export interface CalibrationResults {
  success: boolean;
  confidence_scores: {
    stress: number;
    empathy: number;
    focus: number;
    regulation: number;
  };
  neural_baselines: {
    stress_baseline: number;
    empathy_baseline: number;
    focus_baseline: number;
    regulation_baseline: number;
  };
  recommendations: string[];
  next_steps: string[];
}

/**
 * API response types
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Component prop types
 */
export interface BCIMetricsProps {
  neuralState: NeuralState;
  isConnected: boolean;
  signalQuality: number;
  className?: string;
}

export interface TrainingInterfaceProps {
  session: TrainingSession;
  onMessageSend: (message: string, type: string) => void;
  onSessionComplete: () => void;
  className?: string;
}

export interface NeuralFeedbackProps {
  events: NeuralEvent[];
  insights: string[];
  recommendations: TrainingRecommendation[];
  className?: string;
}

/**
 * Hook return types
 */
export interface UseBCIReturn {
  neuralState: NeuralState | null;
  isConnected: boolean;
  signalQuality: number;
  events: NeuralEvent[];
  connect: (sessionId: string) => Promise<void>;
  disconnect: () => void;
  calibrate: () => Promise<CalibrationResults>;
}

export interface UseTrainingReturn {
  session: TrainingSession | null;
  messages: ConversationMessage[];
  isLoading: boolean;
  error: string | null;
  createSession: (config: Partial<TrainingSession>) => Promise<void>;
  sendMessage: (content: string, type: string) => Promise<void>;
  endSession: () => Promise<void>;
}

export interface UseAnalyticsReturn {
  progress: ProgressAnalytics | null;
  reports: TrainingReport[];
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  generateReport: (sessionId: string) => Promise<TrainingReport>;
}

/**
 * Configuration types
 */
export interface BridgeConfig {
  apiBaseUrl: string;
  wsBaseUrl: string;
  bciEnabled: boolean;
  mockMode: boolean;
  debugging: boolean;
  version: string;
}

/**
 * Error types
 */
export interface BridgeError extends Error {
  code: string;
  details?: any;
  timestamp: string;
}

export class BCIConnectionError extends Error {
  constructor(message: string, public code: string = 'BCI_CONNECTION_ERROR') {
    super(message);
    this.name = 'BCIConnectionError';
  }
}

export class CalibrationError extends Error {
  constructor(message: string, public code: string = 'CALIBRATION_ERROR') {
    super(message);
    this.name = 'CalibrationError';
  }
}

export class TrainingSessionError extends Error {
  constructor(message: string, public code: string = 'TRAINING_SESSION_ERROR') {
    super(message);
    this.name = 'TrainingSessionError';
  }
}

/**
 * Utility types
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Re-export commonly used types
export type {
  NeuralState as Neural,
  TrainingSession as Session,
  ConversationMessage as Message,
  BCIMetrics as Metrics,
  ProgressAnalytics as Progress
};