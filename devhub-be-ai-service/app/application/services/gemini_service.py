import google.generativeai as genai
from typing import Dict, List
import logging
from app.domain.services.ai_service_interface import AIServiceInterface
from app.infrastructure.config import settings

logger = logging.getLogger(__name__)


class GeminiAIService(AIServiceInterface):
    """Implementation of AI service using Google Gemini"""

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini AI Service initialized")

    async def enhance_note(self, action: str, content: str) -> str:
        """Enhance note content based on action"""
        prompts = {
            'summarize': f"Summarize the following note concisely:\n\n{content}",
            'improve': f"Improve the following note, making it more clear and professional:\n\n{content}",
            'generate_doc': f"Generate comprehensive documentation from this note:\n\n{content}",
            'explain_code': f"Explain the following code in detail:\n\n{content}",
        }

        prompt = prompts.get(action, f"Process this note:\n\n{content}")

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error enhancing note: {e}")
            raise

    async def generate_tags(self, content: str) -> List[str]:
        """Generate relevant tags from content"""
        prompt = f"""Generate 3-5 relevant tags for the following content. 
        Return only the tags, separated by commas, no explanations:
        
        {content[:500]}"""

        try:
            response = self.model.generate_content(prompt)
            tags_text = response.text.strip()
            tags = [tag.strip() for tag in tags_text.split(',')]
            return tags[:5]  # Limit to 5 tags
        except Exception as e:
            logger.error(f"Error generating tags: {e}")
            return ['general']

    async def enhance_cv(self, action: str, content: str) -> str:
        """Enhance CV content based on action"""
        prompts = {
            'rewrite_summary': f"Rewrite this professional summary to be more impactful and ATS-friendly:\n\n{content}",
            'improve_experience': f"Improve this work experience description using action verbs and quantifiable achievements:\n\n{content}",
            'generate_skills': f"Based on this experience, suggest relevant technical and soft skills:\n\n{content}",
            'translate': f"Translate this CV section to English while maintaining professional tone:\n\n{content}",
            'suggest_title': f"Suggest a professional job title based on this description:\n\n{content}",
        }

        prompt = prompts.get(action, f"Improve this CV content:\n\n{content}")

        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error enhancing CV: {e}")
            raise

    async def analyze_cv(self, cv_id: int) -> Dict:
        """Analyze CV and provide suggestions"""
        # In a real implementation, you would fetch CV data from database
        analysis = {
            'completeness': 75,
            'ats_score': 68,
            'keyword_density': 'medium',
            'suggestions': [
                'Add more quantifiable achievements',
                'Include relevant keywords for your industry',
                'Expand professional summary',
                'Add certifications if applicable',
            ]
        }
        return analysis

    async def generate_content(self, prompt: str, context: str = None) -> str:
        """Generate content based on prompt"""
        full_prompt = f"{context}\n\n{prompt}" if context else prompt

        try:
            response = self.model.generate_content(full_prompt)
            return response.text
        except Exception as e:
            logger.error(f"Error generating content: {e}")
            raise
