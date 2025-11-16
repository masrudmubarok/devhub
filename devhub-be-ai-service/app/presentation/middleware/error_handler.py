from fastapi import Request, status
from fastapi.responses import JSONResponse
from app.infrastructure.logging import get_logger
import traceback

logger = get_logger(__name__)


async def http_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    
    logger.error(f"Unhandled exception: {exc}")
    logger.error(traceback.format_exc())

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": str(exc),
            "path": str(request.url),
        }
    )
