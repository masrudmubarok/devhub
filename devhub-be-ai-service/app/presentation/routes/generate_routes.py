from fastapi import APIRouter, HTTPException, status
from app.domain.schemas import GenerateRequest, EnhanceResponse, ErrorResponse
from app.application.services.gemini_service import GeminiAIService
from app.infrastructure.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/generate", tags=["generate"])

# Dependency injection
ai_service = GeminiAIService()


@router.post(
    "/",
    response_model=EnhanceResponse,
    status_code=status.HTTP_200_OK,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    }
)
async def generate_content(request: GenerateRequest):
    """Generate content based on custom prompt"""
    try:
        logger.info("Generating content from prompt")
        result = await ai_service.generate_content(
            request.prompt,
            request.context
        )
        
        return EnhanceResponse(
            result=result,
            action="generate"
        )
    except Exception as e:
        logger.error(f"Error generating content: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate content"
        )
