# Bridge AI+BCI Platform API Documentation

## 🧠 Neural Communication Training API v1.0

**Base URL**: `https://api.bridge-ai.com/v1`  
**Authentication**: Bearer Token (JWT)  
**Rate Limiting**: 1000 requests/hour for free tier, unlimited for enterprise

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Neural Calibration](#neural-calibration)
4. [BCI Data Streams](#bci-data-streams)
5. [Training Sessions](#training-sessions)
6. [AI Conversation Engine](#ai-conversation-engine)
7. [Analytics & Reports](#analytics--reports)
8. [Webhooks](#webhooks)
9. [SDKs & Examples](#sdks--examples)

---

## 🔐 Authentication

### JWT Token Authentication
All API requests require a valid JWT token in the Authorization header.

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.bridge-ai.com/v1/users/profile
```

### Get Access Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh_token_here",
  "expires_in": 3600,
  "user": {
    "id": "usr_12345",
    "email": "user@example.com",
    "neural_profile_id": "np_67890"
  }
}
```

---

## 👤 User Management

### Get User Profile
```http
GET /users/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "usr_12345",
  "email": "user@example.com",
  "created_at": "2025-01-01T00:00:00Z",
  "neural_profile": {
    "calibrated": true,
    "baseline_stress": 28,
    "baseline_empathy": 74,
    "baseline_focus": 82,
    "calibration_date": "2025-01-15T10:30:00Z"
  },
  "subscription": {
    "tier": "premium",
    "bci_sessions_remaining": 47,
    "expires_at": "2025-12-31T23:59:59Z"
  }
}
```

### Update Neural Profile
```http
PATCH /users/neural-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "communication_goals": ["empathy_boost", "stress_reduction"],
  "preferred_scenarios": ["workplace", "relationship"],
  "difficulty_preference": "adaptive"
}
```

---

## 🔬 Neural Calibration

### Start Calibration Session
```http
POST /neural/calibration/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "duration_minutes": 5,
  "channels": ["Fp1", "Fp2", "F3", "F4", "C3", "C4", "P3", "P4"],
  "sampling_rate": 256
}
```

**Response:**
```json
{
  "session_id": "cal_session_789",
  "status": "active",
  "estimated_duration": 300,
  "websocket_url": "wss://neural.bridge-ai.com/calibration/cal_session_789",
  "instructions": {
    "phase_1": "Relax and breathe normally for 60 seconds",
    "phase_2": "Think about a peaceful memory for 60 seconds",
    "phase_3": "Recall a mildly stressful situation for 60 seconds"
  }
}
```

### Get Calibration Results
```http
GET /neural/calibration/{session_id}/results
Authorization: Bearer {token}
```

**Response:**
```json
{
  "session_id": "cal_session_789",
  "status": "completed",
  "neural_baseline": {
    "stress_level": 28,
    "focus_index": 82,
    "empathy_score": 74,
    "emotional_regulation": 67
  },
  "confidence_scores": {
    "stress": 0.94,
    "focus": 0.87,
    "empathy": 0.91,
    "regulation": 0.83
  },
  "recommendations": [
    "Your low stress baseline indicates good emotional regulation",
    "High focus index suggests excellent attention control",
    "Empathy score shows strong mirror neuron activity"
  ]
}
```

---

## ⚡ BCI Data Streams

### Real-time Neural Data WebSocket
Connect to live BCI data during training sessions:

```javascript
const ws = new WebSocket('wss://neural.bridge-ai.com/stream/session_123');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Neural data:', data);
};
```

**Real-time Data Format:**
```json
{
  "timestamp": "2025-01-15T14:30:25.123Z",
  "session_id": "training_session_456",
  "neural_state": {
    "stress_level": 45,
    "empathy_activation": 73,
    "emotional_regulation": 68,
    "prefrontal_engagement": 84,
    "amygdala_activity": 32
  },
  "brainwave_bands": {
    "alpha": 12.5,
    "beta": 18.7,
    "gamma": 35.2,
    "theta": 6.8,
    "delta": 2.1
  },
  "neural_coherence": 0.78,
  "insights": [
    "Increased mirror neuron activity detected",
    "Stress response within optimal range",
    "Strong emotional regulation engagement"
  ]
}
```

### BCI Event Detection
```http
POST /neural/events/detect
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": "training_session_456",
  "event_types": ["empathy_spike", "stress_threshold", "attention_drop"],
  "sensitivity": "medium"
}
```

**Response:**
```json
{
  "event_id": "evt_789",
  "webhook_url": "https://your-app.com/neural-events",
  "detected_events": [
    {
      "type": "empathy_spike",
      "timestamp": "2025-01-15T14:32:10.456Z",
      "confidence": 0.92,
      "neural_context": "Response to AI partner emotional expression"
    }
  ]
}
```

---

## 🎭 Training Sessions

### Create Training Session
```http
POST /training/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "scenario_type": "relationship_conflict",
  "ai_partner_config": {
    "personality": "emotional_expressive",
    "conflict_intensity": "medium",
    "response_style": "defensive_initially"
  },
  "training_goals": ["empathy_boost", "stress_reduction"],
  "duration_target": 15,
  "bci_monitoring": true
}
```

**Response:**
```json
{
  "session_id": "train_session_789",
  "status": "initializing",
  "ai_partner": {
    "name": "Alex",
    "background": "Your romantic partner who feels unheard",
    "initial_message": "I feel like you never really listen to what I'm saying..."
  },
  "neural_targets": {
    "stress_reduction_goal": 20,
    "empathy_increase_goal": 15,
    "regulation_improvement": 10
  },
  "websocket_urls": {
    "conversation": "wss://chat.bridge-ai.com/sessions/train_session_789",
    "neural_stream": "wss://neural.bridge-ai.com/stream/train_session_789"
  }
}
```

### Send Conversation Message
```http
POST /training/sessions/{session_id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "I hear you saying you feel unheard. That must be frustrating.",
  "response_type": "empathetic",
  "neural_state_at_response": {
    "stress_level": 42,
    "empathy_activation": 78,
    "prefrontal_engagement": 85
  }
}
```

**Response:**
```json
{
  "message_id": "msg_456",
  "ai_response": {
    "content": "Thank you for acknowledging that. I appreciate you really listening.",
    "emotional_tone": "relieved_appreciative",
    "conflict_escalation": -2
  },
  "neural_feedback": {
    "response_quality": "excellent",
    "empathy_score_change": +5,
    "stress_impact": -3,
    "neural_pathway_strengthening": 4
  },
  "coaching_tip": "Great empathetic response! Your mirror neurons showed strong activation."
}
```

### Get Session Analytics
```http
GET /training/sessions/{session_id}/analytics
Authorization: Bearer {token}
```

**Response:**
```json
{
  "session_id": "train_session_789",
  "duration_minutes": 18,
  "exchanges_count": 12,
  "neural_improvements": {
    "stress_reduction": -23,
    "empathy_increase": +18,
    "regulation_improvement": +12,
    "new_neural_pathways": 7
  },
  "conversation_quality": {
    "empathetic_responses": 8,
    "defensive_responses": 2,
    "neutral_responses": 2,
    "overall_score": "A-"
  },
  "breakthrough_moments": [
    {
      "timestamp": "14:35:22",
      "description": "Significant empathy activation during partner vulnerability",
      "neural_signature": "mirror_neuron_burst"
    }
  ]
}
```

---

## 🤖 AI Conversation Engine

### Generate AI Response
```http
POST /ai/generate-response
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversation_context": [
    {"role": "ai", "content": "I feel like you never listen to me..."},
    {"role": "user", "content": "I hear you saying you feel unheard."}
  ],
  "ai_personality": "emotional_expressive",
  "user_neural_state": {
    "stress_level": 42,
    "empathy_activation": 78
  },
  "training_goal": "empathy_development"
}
```

**Response:**
```json
{
  "response": {
    "content": "Thank you for acknowledging my feelings. That means a lot to me.",
    "emotional_tone": "grateful_relieved",
    "conflict_level": 2,
    "empathy_trigger_words": ["acknowledging", "feelings", "means a lot"]
  },
  "learning_insights": {
    "why_this_response": "AI detected your empathetic approach and responded positively",
    "neural_training_value": "Reinforces mirror neuron activation patterns",
    "alternative_responses": [
      "More challenging: 'That's a start, but I need to see consistent change'",
      "More appreciative: 'You really get it now. This is what I needed to hear.'"
    ]
  }
}
```

### Customize AI Partner
```http
PUT /ai/partners/{partner_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "personality_traits": {
    "emotional_expression": 0.8,
    "conflict_escalation_tendency": 0.6,
    "empathy_receptiveness": 0.7,
    "communication_directness": 0.4
  },
  "background_story": "A partner who has felt emotionally neglected",
  "trigger_phrases": ["you never", "you always", "I feel like"],
  "resolution_conditions": {
    "empathy_threshold": 75,
    "validation_required": true,
    "action_commitment_needed": false
  }
}
```

---

## 📊 Analytics & Reports

### Get Neural Progress Report
```http
GET /analytics/neural-progress
Authorization: Bearer {token}
Query Parameters:
  - period: "7d" | "30d" | "90d" | "1y"
  - metrics: "stress,empathy,regulation,pathways"
```

**Response:**
```json
{
  "period": "30d",
  "neural_progress": {
    "stress_reduction": {
      "baseline": 45,
      "current": 28,
      "improvement_percentage": -38,
      "trend": "strongly_improving"
    },
    "empathy_development": {
      "baseline": 74,
      "current": 89,
      "improvement_percentage": 20,
      "trend": "steadily_improving"
    },
    "emotional_regulation": {
      "baseline": 67,
      "current": 82,
      "improvement_percentage": 22,
      "trend": "improving"
    }
  },
  "neural_pathways": {
    "total_new_connections": 127,
    "strengthened_existing": 89,
    "neural_plasticity_score": 0.84
  },
  "session_statistics": {
    "total_sessions": 23,
    "average_duration": 16.4,
    "completion_rate": 0.96,
    "favorite_scenarios": ["relationship", "workplace"]
  }
}
```

### Generate Comprehensive Report
```http
POST /analytics/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "report_type": "neural_development_comprehensive",
  "include_sections": [
    "neural_baseline_comparison",
    "training_session_analysis", 
    "neuroplasticity_measurements",
    "communication_skill_progression",
    "personalized_recommendations"
  ],
  "format": "pdf",
  "include_brainwave_visualizations": true
}
```

**Response:**
```json
{
  "report_id": "rpt_12345",
  "status": "generating",
  "estimated_completion": "2025-01-15T15:00:00Z",
  "download_url": "https://reports.bridge-ai.com/rpt_12345.pdf",
  "webhook_notification": true
}
```

---

## 🔔 Webhooks

### Configure Neural Event Webhooks
```http
POST /webhooks/neural-events
Authorization: Bearer {token}
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/neural-events",
  "events": [
    "neural_breakthrough",
    "stress_threshold_exceeded", 
    "empathy_milestone_reached",
    "session_completed"
  ],
  "secret": "your_webhook_secret"
}
```

### Webhook Event Examples

**Neural Breakthrough Event:**
```json
{
  "event": "neural_breakthrough",
  "timestamp": "2025-01-15T14:35:22.123Z",
  "user_id": "usr_12345",
  "session_id": "train_session_789",
  "data": {
    "breakthrough_type": "empathy_activation_surge",
    "neural_coherence": 0.92,
    "significance_score": 8.7,
    "description": "Unprecedented mirror neuron activation during conflict resolution"
  }
}
```

**Training Completion:**
```json
{
  "event": "session_completed",
  "timestamp": "2025-01-15T14:45:00.000Z",
  "user_id": "usr_12345",
  "session_id": "train_session_789",
  "data": {
    "duration_minutes": 18,
    "neural_improvements": {
      "stress_reduction": -15,
      "empathy_increase": +12,
      "new_pathways": 5
    },
    "performance_grade": "A-"
  }
}
```

---

## 🛠️ SDKs & Examples

### JavaScript/TypeScript SDK

```bash
npm install @bridge-ai/sdk
```

```typescript
import { BridgeAI } from '@bridge-ai/sdk';

const bridge = new BridgeAI({
  apiKey: 'your_api_key',
  environment: 'production' // or 'sandbox'
});

// Start a training session
const session = await bridge.training.createSession({
  scenario: 'relationship_conflict',
  aiPartner: {
    personality: 'emotional_expressive',
    intensity: 'medium'
  },
  bciMonitoring: true
});

// Listen to real-time neural data
bridge.neural.onDataStream(session.id, (data) => {
  console.log('Neural state:', data.neural_state);
  console.log('Insights:', data.insights);
});

// Send a message and get AI response with neural feedback
const response = await bridge.conversation.sendMessage(session.id, {
  content: "I understand how you feel",
  type: 'empathetic'
});
```

### Python SDK

```bash
pip install bridge-ai-sdk
```

```python
from bridge_ai import BridgeAI

client = BridgeAI(api_key='your_api_key')

# Start neural calibration
calibration = client.neural.start_calibration(
    duration_minutes=5,
    channels=['Fp1', 'Fp2', 'F3', 'F4']
)

# Get results
results = client.neural.get_calibration_results(calibration.session_id)
print(f"Baseline stress: {results.neural_baseline.stress_level}")

# Create training session
session = client.training.create_session(
    scenario_type='workplace_conflict',
    ai_partner_config={
        'personality': 'direct_challenging',
        'conflict_intensity': 'high'
    }
)
```

### React Hooks

```tsx
import { useBridgeAI, useNeuralStream } from '@bridge-ai/react';

function TrainingComponent() {
  const { session, createSession, sendMessage } = useBridgeAI();
  const { neuralData, isConnected } = useNeuralStream(session?.id);

  const handleResponse = async (message: string) => {
    const response = await sendMessage(message, {
      responseType: 'empathetic',
      neuralState: neuralData?.neural_state
    });
    
    // Handle AI response and neural feedback
  };

  return (
    <div>
      <NeuralMetrics data={neuralData} />
      <ConversationInterface onResponse={handleResponse} />
    </div>
  );
}
```

---

## 📝 Error Handling

### Standard Error Response Format
```json
{
  "error": {
    "code": "NEURAL_CALIBRATION_FAILED",
    "message": "Neural calibration session timed out",
    "details": {
      "session_id": "cal_session_789",
      "duration_attempted": 600,
      "signal_quality": "poor"
    },
    "suggestions": [
      "Ensure electrodes are properly positioned",
      "Minimize movement during calibration",
      "Check for environmental electrical interference"
    ]
  },
  "request_id": "req_abc123"
}
```

### Common Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `NEURAL_CALIBRATION_FAILED` | Neural calibration could not be completed | 422 |
| `INSUFFICIENT_SIGNAL_QUALITY` | BCI signal quality below threshold | 422 |
| `SESSION_LIMIT_EXCEEDED` | User has exceeded session limits for their tier | 429 |
| `INVALID_NEURAL_DATA` | Malformed or invalid neural data submission | 400 |
| `AI_PARTNER_GENERATION_FAILED` | Could not generate AI partner with given parameters | 422 |
| `WEBSOCKET_CONNECTION_FAILED` | Real-time connection could not be established | 503 |

---

## 🔬 Advanced Features

### Neural Pattern Recognition API
```http
POST /neural/patterns/analyze
Authorization: Bearer {token}
Content-Type: application/json

{
  "eeg_data": "base64_encoded_eeg_data",
  "analysis_type": "communication_readiness",
  "pattern_detection": ["empathy_markers", "stress_indicators", "focus_states"]
}
```

### Custom AI Training
```http
POST /ai/models/fine-tune
Authorization: Bearer {token}
Content-Type: application/json

{
  "base_model": "bridge_conversation_v2",
  "training_data": [
    {
      "context": "relationship_conflict_scenario", 
      "user_neural_state": {...},
      "optimal_ai_response": "..."
    }
  ],
  "optimization_target": "neural_empathy_activation"
}
```

---

## 📚 Resources & Support

- **API Reference**: [https://docs.bridge-ai.com/api](https://docs.bridge-ai.com/api)
- **SDKs**: [https://github.com/bridge-ai/sdks](https://github.com/bridge-ai/sdks)
- **Postman Collection**: [Download Collection](https://api.bridge-ai.com/postman-collection.json)
- **Support**: [support@bridge-ai.com](mailto:support@bridge-ai.com)
- **Community**: [https://community.bridge-ai.com](https://community.bridge-ai.com)

---

## 🚀 Rate Limits & Pricing

### Free Tier
- 100 API calls/hour
- 3 training sessions/day
- Basic neural analytics
- Community support

### Pro Tier ($29.99/month)
- 1,000 API calls/hour  
- Unlimited training sessions
- Advanced neural analytics
- Real-time BCI streaming
- Priority support

### Enterprise (Custom pricing)
- Unlimited API access
- Custom AI model training
- White-label solutions
- Dedicated neural scientist support
- SLA guarantees

---

*© 2025 Bridge AI. Transforming human communication through neuroscience and artificial intelligence.*