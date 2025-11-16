from fastapi import APIRouter, HTTPException, status
from app.domain.schemas import (
    NoteEnhanceRequest,
    EnhanceResponse,
    TagsResponse,
    ErrorResponse,
)
from app.application.services.gemini_service import GeminiAIService
from app.infrastructure.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/notes", tags=["notes"])

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
async def enhance_note(request: NoteEnhanceRequest):
    """
    Enhance note content using AI
    
    Actions:
    - summarize: Create a concise summary
    - improve: Improve clarity and professionalism
    - generate_doc: Generate comprehensive documentation
    - explain_code: Explain code snippets
    """
    try:
        logger.info(f"Enhancing note with action: {request.action}")
        result = await ai_service.enhance_note(request.action, request.content)
        
        return EnhanceResponse(
            result=result,
            action=request.action
        )
    except Exception as e:
        logger.error(f"Error enhancing note: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to enhance note"
        )


@router.post(
    "/generate-tags",
    response_model=TagsResponse,
    status_code=status.HTTP_200_OK
)
async def generate_tags(request: NoteEnhanceRequest):
    """Generate relevant tags for note content"""
    try:
        logger.info("Generating tags for note")
        tags = await ai_service.generate_tags(request.content)
        
        return TagsResponse(tags=tags)
    except Exception as e:
        logger.error(f"Error generating tags: {e}")
        # Return default tags on error
        return TagsResponse(tags=['general'])
