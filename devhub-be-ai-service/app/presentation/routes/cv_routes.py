from fastapi import APIRouter, HTTPException, status
from app.domain.schemas import (
    CVEnhanceRequest,
    EnhanceResponse,
    AnalysisResponse,
    ErrorResponse,
)
from app.application.services.gemini_service import GeminiAIService
from app.infrastructure.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/cv", tags=["cv"])

# Dependency injection
ai_service = GeminiAIService()


@router.post(
    "/enhance",
    response_model=EnhanceResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    }
)
async def enhance_cv(request: CVEnhanceRequest):
    """
    Enhance CV content using AI
    
    Actions:
    - rewrite_summary: Rewrite professional summary
    - improve_experience: Enhance work experience descriptions
    - generate_skills: Suggest relevant skills
    - translate: Translate content to English
    - suggest_title: Suggest professional job title
    """
    try:
        logger.info(f"Enhancing CV with action: {request.action}")
        result = await ai_service.enhance_cv(request.action, request.content)
        
        return EnhanceResponse(
            result=result,
            action=request.action
        )
    except Exception as e:
        logger.error(f"Error enhancing CV: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to enhance CV"
        )


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK
)
async def analyze_cv(request: CVEnhanceRequest):
    """Analyze CV and provide improvement suggestions"""
    try:
        logger.info(f"Analyzing CV: {request.cv_id}")
        analysis = await ai_service.analyze_cv(request.cv_id or 0)
        
        return AnalysisResponse(
            analysis=analysis,
            suggestions=analysis.get('suggestions', [])
        )
    except Exception as e:
        logger.error(f"Error analyzing CV: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze CV"
        )
