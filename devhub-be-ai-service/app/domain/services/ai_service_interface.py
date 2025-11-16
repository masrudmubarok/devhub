from abc import ABC, abstractmethod
from typing import Dict, List


class AIServiceInterface(ABC):
    """Interface for AI enhancement services"""

    @abstractmethod
    async def enhance_note(self, action: str, content: str) -> str:
        """Enhance note content based on action"""
        pass

    @abstractmethod
    async def generate_tags(self, content: str) -> List[str]:
        """Generate tags from content"""
        pass

    @abstractmethod
    async def enhance_cv(self, action: str, content: str) -> str:
        """Enhance CV content based on action"""
        pass

    @abstractmethod
    async def analyze_cv(self, cv_id: int) -> Dict:
        """Analyze CV and provide suggestions"""
        pass

    @abstractmethod
    async def generate_content(self, prompt: str, context: str = None) -> str:
        """Generate content based on prompt"""
        pass
