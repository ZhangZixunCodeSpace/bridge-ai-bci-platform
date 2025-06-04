import asyncio
from typing import Dict, List, Optional, Any
from loguru import logger
import openai
from openai import AsyncOpenAI
import json
from datetime import datetime

from ..config.settings import settings
from .redis_service import redis_service


class AIService:
    """AI service for conversation generation and analysis."""
    
    def __init__(self):
        self.client: Optional[AsyncOpenAI] = None
        self.conversation_cache: Dict[str, List[Dict]] = {}
        self.personality_templates = {
            "emotional": {
                "description": "Expressive and emotionally driven communicator",
                "traits": ["emotional", "expressive", "sensitive", "reactive"],
                "communication_style": "Uses emotional language, shares feelings openly, seeks emotional validation"
            },
            "direct": {
                "description": "Straightforward and blunt communicator",
                "traits": ["direct", "honest", "no-nonsense", "confrontational"],
                "communication_style": "Speaks plainly, gets to the point, doesn't sugarcoat messages"
            },
            "passive-aggressive": {
                "description": "Indirect and subtly hostile communicator",
                "traits": ["indirect", "sarcastic", "resentful", "defensive"],
                "communication_style": "Uses subtle digs, avoids direct confrontation, employs sarcasm"
            },
            "logical": {
                "description": "Analytical and fact-based communicator",
                "traits": ["logical", "analytical", "fact-focused", "methodical"],
                "communication_style": "Focuses on facts and logic, seeks rational solutions, avoids emotional appeals"
            }
        }
    
    async def initialize(self):
        """Initialize the AI service."""
        try:
            if settings.FEATURE_REAL_AI and settings.OPENAI_API_KEY != "demo-key":
                self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                
                # Test the connection
                response = await self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=10
                )
                logger.info("✅ OpenAI API connection verified")
            else:
                logger.info("📝 Using mock AI responses (demo mode)")
                
        except Exception as e:
            logger.warning(f"⚠️ OpenAI API not available, using mock responses: {e}")
            self.client = None
    
    async def cleanup(self):
        """Cleanup resources."""
        if self.client:
            await self.client.close()
    
    def _generate_mock_analysis(self, conversation_history: List[Dict], neural_data: Optional[Dict]) -> Dict[str, Any]:
        """Generate mock conversation analysis."""
        
        total_exchanges = len(conversation_history)
        empathetic_responses = sum(1 for exchange in conversation_history 
                                 if any(word in exchange.get("user_message", "").lower() 
                                       for word in ["understand", "feel", "sorry", "hear"]))
        
        defensive_responses = sum(1 for exchange in conversation_history 
                                if any(word in exchange.get("user_message", "").lower() 
                                      for word in ["wrong", "not", "but", "however"]))
        
        # Calculate improvement metrics
        empathy_score = (empathetic_responses / max(total_exchanges, 1)) * 100
        stress_reduction = max(20, 100 - (defensive_responses / max(total_exchanges, 1)) * 100)
        
        analysis = {
            "conversation_summary": {
                "total_exchanges": total_exchanges,
                "empathetic_responses": empathetic_responses,
                "defensive_responses": defensive_responses,
                "communication_pattern": "improving" if empathetic_responses > defensive_responses else "needs_work"
            },
            "metrics": {
                "empathy_score": round(empathy_score, 1),
                "stress_reduction": round(stress_reduction, 1),
                "emotional_regulation": round((empathy_score + stress_reduction) / 2, 1),
                "communication_effectiveness": round(min(95, empathy_score * 1.2), 1)
            },
            "insights": [
                "User showed improved empathetic responding during conflict",
                "Stress levels decreased as conversation progressed",
                "Neural pathways for emotional regulation strengthened",
                "Communication pattern shifted from defensive to collaborative"
            ],
            "recommendations": [
                "Continue practicing active listening techniques",
                "Focus on emotional validation before problem-solving",
                "Develop pause-and-reflect responses to reduce reactivity",
                "Practice perspective-taking exercises"
            ],
            "neural_improvements": {
                "new_pathways_formed": total_exchanges * 3 + empathetic_responses * 2,
                "stress_response_reduction": f"{round(stress_reduction)}%",
                "empathy_network_strengthening": f"{round(empathy_score)}%",
                "prefrontal_cortex_activation": "increased by 34%"
            }
        }
        
        if neural_data:
            analysis["neural_correlation"] = {
                "avg_stress_during_training": neural_data.get("avg_stress", 35),
                "peak_empathy_activation": neural_data.get("peak_empathy", 82),
                "emotional_regulation_consistency": neural_data.get("regulation", 78)
            }
        
        return analysis


# Create global AI service instance
ai_service = AIService()