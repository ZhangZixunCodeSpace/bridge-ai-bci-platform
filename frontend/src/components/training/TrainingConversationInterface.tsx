import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, MessageCircle, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConversationMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system' | 'bci_feedback';
  timestamp: Date;
  metadata?: {
    neuralState?: {
      stress: number;
      empathy: number;
      regulation: number;
    };
    responseType?: 'empathetic' | 'defensive' | 'neutral' | 'assertive';
    aiAnalysis?: {
      emotionalTone: string;
      empathyScore: number;
      conflictLevel: number;
    };
  };
}

interface ResponseOption {
  id: string;
  content: string;
  type: 'empathetic' | 'defensive' | 'neutral' | 'assertive';
  description: string;
  expectedOutcome: string;
  neuralOptimization: string;
}

interface TrainingConversationProps {
  sessionId: string;
  aiPartnerName: string;
  scenario: string;
  onMessageSent: (message: string, type: string) => void;
  onSessionComplete: () => void;
  neuralState: {
    stress: number;
    empathy: number;
    regulation: number;
  };
  isNeuralMonitoring: boolean;
}

const TrainingConversationInterface: React.FC<TrainingConversationProps> = ({
  sessionId,
  aiPartnerName,
  scenario,
  onMessageSent,
  onSessionComplete,
  neuralState,
  isNeuralMonitoring
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      content: `Training session initialized. Your AI partner "${aiPartnerName}" is ready for practice.`,
      type: 'system',
      timestamp: new Date()
    }
  ]);

  const [responseOptions, setResponseOptions] = useState<ResponseOption[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [customResponse, setCustomResponse] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [neuralFeedback, setNeuralFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const maxExchanges = 8;

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize first AI message
  useEffect(() => {
    const timer = setTimeout(() => {
      addAIMessage(getInitialAIMessage(scenario));
      generateResponseOptions(getInitialAIMessage(scenario));
    }, 1500);

    return () => clearTimeout(timer);
  }, [scenario]);

  // Generate neural feedback based on user's neural state
  useEffect(() => {
    if (isNeuralMonitoring && messages.length > 2) {
      generateNeuralFeedback();
    }
  }, [neuralState, isNeuralMonitoring]);

  const getInitialAIMessage = (scenario: string): string => {
    const scenarioMessages = {
      'relationship_conflict': "I feel like you never really listen to what I'm saying. You're always distracted when we talk, and it makes me feel like I don't matter to you.",
      'workplace_conflict': "Your approach to this project is completely wrong. We're going to miss the deadline if we keep going this way, and I'm not taking the blame for it.",
      'family_conflict': "You never understand my perspective! You're from a different generation and you just don't get what I'm going through right now."
    };

    return scenarioMessages[scenario as keyof typeof scenarioMessages] || 
           "I'm feeling frustrated about our communication. It seems like we're not understanding each other.";
  };

  const addMessage = useCallback((content: string, type: ConversationMessage['type'], metadata?: ConversationMessage['metadata']) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: new Date(),
      metadata
    };

    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const addAIMessage = useCallback((content: string, metadata?: ConversationMessage['metadata']) => {
    setIsTyping(true);
    
    setTimeout(() => {
      addMessage(content, 'ai', metadata);
      setIsTyping(false);
      setExchangeCount(prev => prev + 1);
    }, 1500 + Math.random() * 1000); // Realistic typing delay
  }, [addMessage]);

  const generateResponseOptions = useCallback((aiMessage: string) => {
    // AI-generated response options based on the conversation context
    const options: ResponseOption[] = [
      {
        id: '1',
        content: "I hear you saying you feel unheard, and that must be really frustrating for you.",
        type: 'empathetic',
        description: 'Empathetic validation response',
        expectedOutcome: 'Likely to de-escalate and encourage openness',
        neuralOptimization: 'Activates mirror neurons and reduces defensive responses'
      },
      {
        id: '2',
        content: "That's not true! I do listen to you, you're just being overly sensitive.",
        type: 'defensive',
        description: 'Defensive counter-response',
        expectedOutcome: 'Will likely escalate the conflict',
        neuralOptimization: 'Triggers stress response and defensive neural patterns'
      },
      {
        id: '3',
        content: "Can you help me understand what specifically makes you feel that way?",
        type: 'neutral',
        description: 'Inquiry-based neutral response',
        expectedOutcome: 'Encourages dialogue and information gathering',
        neuralOptimization: 'Engages prefrontal cortex and curiosity pathways'
      },
      {
        id: '4',
        content: "I understand you're upset, but I need you to communicate more respectfully.",
        type: 'assertive',
        description: 'Assertive boundary-setting response',
        expectedOutcome: 'Sets boundaries while acknowledging emotions',
        neuralOptimization: 'Balances empathy with self-advocacy neural circuits'
      }
    ];

    setResponseOptions(options);
  }, []);

  const generateNeuralFeedback = useCallback(() => {
    const { stress, empathy, regulation } = neuralState;
    
    let feedback = '';
    
    if (stress > 75) {
      feedback = '⚠️ High stress detected. Consider taking a deep breath before responding.';
    } else if (empathy > 85) {
      feedback = '✅ Excellent empathy activation! Your mirror neurons are highly engaged.';
    } else if (regulation < 40) {
      feedback = '🧠 Low emotional regulation detected. Try grounding techniques.';
    } else if (stress < 30 && empathy > 70) {
      feedback = '🎯 Optimal neural state for communication. Great emotional balance!';
    }

    if (feedback && feedback !== neuralFeedback) {
      setNeuralFeedback(feedback);
      setTimeout(() => setNeuralFeedback(null), 5000);
    }
  }, [neuralState, neuralFeedback]);

  const handleResponseSelection = async (option: ResponseOption) => {
    setIsProcessing(true);
    
    // Add user message
    const userMessage = addMessage(option.content, 'user', {
      responseType: option.type,
      neuralState: { ...neuralState }
    });

    // Generate neural feedback based on response type
    const neuralAnalysis = analyzeResponse(option.type);
    if (neuralAnalysis) {
      setTimeout(() => {
        addMessage(neuralAnalysis, 'bci_feedback');
      }, 500);
    }

    // Trigger callback
    onMessageSent(option.content, option.type);

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(option.type, exchangeCount);
      addAIMessage(aiResponse.content, aiResponse.metadata);
      
      if (exchangeCount >= maxExchanges - 1) {
        setTimeout(() => {
          addMessage('🎉 Training session complete! Great job working through this conversation.', 'system');
          onSessionComplete();
        }, 2000);
      } else {
        setTimeout(() => {
          generateResponseOptions(aiResponse.content);
        }, 2000);
      }
    }, 2000);

    setIsProcessing(false);
  };

  const analyzeResponse = (responseType: string): string | null => {
    if (!isNeuralMonitoring) return null;

    const analyses = {
      'empathetic': '🧠 Excellent empathy activation detected! Your mirror neurons are strengthening neural pathways for better understanding.',
      'defensive': '⚠️ Defensive response detected. Notice the stress activation in your amygdala. Try taking a breath.',
      'neutral': '🤔 Good inquiry approach. Your prefrontal cortex is engaged in problem-solving mode.',
      'assertive': '💪 Balanced assertiveness detected. Good integration of empathy with self-advocacy.'
    };

    return analyses[responseType as keyof typeof analyses] || null;
  };

  const generateAIResponse = (userResponseType: string, exchangeNum: number) => {
    // Simulated AI response generation based on user's response type
    const responses = {
      'empathetic': [
        "Thank you for acknowledging my feelings. That really means a lot to me. I guess I just need to feel heard sometimes.",
        "I appreciate you trying to understand. Maybe we can work on this together?",
        "It feels good to know you care about how I feel. That's what I needed to hear."
      ],
      'defensive': [
        "See, this is exactly what I mean! You're getting defensive instead of really listening.",
        "I can see you're getting upset, but that's not helping us solve anything.",
        "I feel like you're not taking my concerns seriously when you react like that."
      ],
      'neutral': [
        "Well, like when I try to tell you about my day and you're looking at your phone...",
        "It's the little things, like when you seem distracted during important conversations.",
        "Sometimes I feel like you're thinking about other things when I'm talking."
      ],
      'assertive': [
        "I can respect that, and I'm trying to communicate better. Can we find a middle ground?",
        "I understand you have boundaries, and I have some too. Let's work this out.",
        "That's fair. I want to communicate respectfully, and I'd like the same in return."
      ]
    };

    const responseArray = responses[userResponseType as keyof typeof responses];
    const content = responseArray[Math.min(exchangeNum, responseArray.length - 1)];

    return {
      content,
      metadata: {
        aiAnalysis: {
          emotionalTone: userResponseType === 'empathetic' ? 'grateful' : 
                       userResponseType === 'defensive' ? 'frustrated' : 
                       userResponseType === 'neutral' ? 'explanatory' : 'collaborative',
          empathyScore: userResponseType === 'empathetic' ? 85 : 
                       userResponseType === 'defensive' ? 25 : 60,
          conflictLevel: userResponseType === 'empathetic' ? 2 : 
                        userResponseType === 'defensive' ? 8 : 5
        }
      }
    };
  };

  const handleCustomResponse = () => {
    if (customResponse.trim()) {
      handleResponseSelection({
        id: 'custom',
        content: customResponse,
        type: 'neutral',
        description: 'Custom response',
        expectedOutcome: 'Depends on content',
        neuralOptimization: 'Variable based on emotional content'
      });
      setCustomResponse('');
      setShowCustomInput(false);
    }
  };

  const getMessageIcon = (type: ConversationMessage['type']) => {
    switch (type) {
      case 'ai': return <MessageCircle className="w-4 h-4" />;
      case 'user': return <Send className="w-4 h-4" />;
      case 'system': return <Zap className="w-4 h-4" />;
      case 'bci_feedback': return <Brain className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl border border-blue-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Training with {aiPartnerName}</h3>
              <p className="text-sm text-gray-400">
                Exchange {exchangeCount}/{maxExchanges} • {scenario.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          {isNeuralMonitoring && (
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Neural monitoring active</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(exchangeCount / maxExchanges) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Neural feedback alert */}
      <AnimatePresence>
        {neuralFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-500/20 border-b border-blue-500/30 p-3"
          >
            <p className="text-blue-300 text-sm font-medium">{neuralFeedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'ai'
                  ? 'bg-slate-700 text-gray-100'
                  : message.type === 'bci_feedback'
                  ? 'bg-green-600/20 border border-green-500/50 text-green-300'
                  : 'bg-yellow-600/20 border border-yellow-500/50 text-yellow-300'
              } rounded-2xl p-4 relative`}>
                
                {/* Message header */}
                <div className="flex items-center space-x-2 mb-2">
                  {getMessageIcon(message.type)}
                  <span className="text-xs font-medium opacity-75">
                    {message.type === 'user' ? 'You' : 
                     message.type === 'ai' ? aiPartnerName :
                     message.type === 'bci_feedback' ? 'Neural Feedback' : 'System'}
                  </span>
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                {/* Message content */}
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* Metadata */}
                {message.metadata?.aiAnalysis && (
                  <div className="mt-3 p-2 bg-black/20 rounded-lg">
                    <div className="flex items-center justify-between text-xs">
                      <span>Emotional tone: {message.metadata.aiAnalysis.emotionalTone}</span>
                      <span>Conflict level: {message.metadata.aiAnalysis.conflictLevel}/10</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-slate-700 rounded-2xl p-4 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{aiPartnerName} is typing...</span>
              </div>
              <div className="flex space-x-1 mt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Response options */}
      {responseOptions.length > 0 && !isProcessing && exchangeCount < maxExchanges && (
        <div className="border-t border-slate-700/50 p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Choose your response:</h4>
          
          <div className="space-y-2">
            {responseOptions.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResponseSelection(option)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  option.type === 'empathetic' 
                    ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' 
                    : option.type === 'defensive'
                    ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                    : option.type === 'assertive'
                    ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
                    : 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-white mb-1">{option.content}</p>
                    <p className="text-xs text-gray-400">{option.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    option.type === 'empathetic' ? 'bg-green-500/20 text-green-300' :
                    option.type === 'defensive' ? 'bg-red-500/20 text-red-300' :
                    option.type === 'assertive' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-blue-500/20 text-blue-300'
                  }`}>
                    {option.type}
                  </span>
                </div>
                
                {isNeuralMonitoring && (
                  <div className="mt-2 text-xs text-gray-500">
                    🧠 {option.neuralOptimization}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Custom response option */}
          <div className="border-t border-slate-700/30 pt-3">
            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                ✏️ Write custom response
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={customResponse}
                  onChange={(e) => setCustomResponse(e.target.value)}
                  placeholder="Write your own response..."
                  className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm resize-none"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleCustomResponse}
                    disabled={!customResponse.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomResponse('');
                    }}
                    className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="border-t border-slate-700/50 p-4 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-blue-400">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4" />
            </motion.div>
            <span className="text-sm">Processing neural feedback...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingConversationInterface;