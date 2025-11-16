from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.infrastructure.config import settings
from app.infrastructure.logging import setup_logging, get_logger
from app.presentation.routes import notes_routes, cv_routes, generate_routes
from app.presentation.middleware.error_handler import http_exception_handler

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"Environment: {'Development' if settings.DEBUG else 'Production'}")
    yield
    # Shutdown
    logger.info("Shutting down AI Service")


def create_application() -> FastAPI:
    """Create and configure FastAPI application"""
    
    # Setup logging
    setup_logging()

    # Create FastAPI app
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="AI Enhancement Service for DevHub using Google Gemini",
        lifespan=lifespan,
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register exception handlers
    app.add_exception_handler(Exception, http_exception_handler)

    # Register routes
    app.include_router(notes_routes.router)
    app.include_router(cv_routes.router)
    app.include_router(generate_routes.router)

    # Health check
    @app.get("/health", tags=["health"])
    async def health_check():
        return {
            "status": "healthy",
            "service": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }

    @app.get("/", tags=["root"])
    async def root():
        return {
            "message": f"Welcome to {settings.APP_NAME}",
            "version": settings.APP_VERSION,
            "docs": "/docs",
        }

    return app


app = create_application()


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    prompts = {
        "summarize": f"Summarize the following note concisely while keeping key points:\n\n{request.content}",
        "improve": f"Improve this note to be clearer, more professional, and better organized:\n\n{request.content}",
        "generate_doc": f"Convert this note into professional developer documentation:\n\n{request.content}",
        "explain_code": f"Explain the following code snippet in detail:\n\n{request.content}"
    }
    
    prompt = prompts.get(request.action)
    if not prompt:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    try:
        response = model.generate_content(prompt)
        return {
            "original_content": request.content,
            "enhanced_content": response.text,
            "action": request.action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/notes/generate-tags")
async def generate_tags(content: str):
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    prompt = f"Generate 5 relevant tags for this note (return only comma-separated tags):\n\n{content}"
    
    try:
        response = model.generate_content(prompt)
        tags = [tag.strip() for tag in response.text.split(",")]
        return {"tags": tags[:5]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# CV Enhancement Endpoints
@app.post("/cv/enhance")
async def enhance_cv(request: CVEnhanceRequest):
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    prompts = {
        "rewrite_summary": f"""Rewrite this professional summary to be more compelling and ATS-friendly:

{request.content}

Requirements:
- Keep it concise (3-4 lines)
- Highlight key strengths
- Make it results-oriented
- Use strong action verbs""",
        
        "improve_experience": f"""Improve these job experience bullet points to be more impactful:

{request.content}

Requirements:
- Start with strong action verbs
- Include quantifiable results where possible
- Make them achievement-oriented
- Keep them concise and clear""",
        
        "generate_skills": f"""Based on these job experiences, suggest relevant technical skills:

{request.content}

Return a categorized list of skills (Technical Skills, Soft Skills, Tools & Technologies)""",
        
        "translate": f"Translate this CV content to professional Indonesian/English (auto-detect and translate to the other language):\n\n{request.content}",
        
        "suggest_title": f"Suggest 3 modern, professional job titles based on this experience:\n\n{request.content}"
    }
    
    prompt = prompts.get(request.action)
    if not prompt:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    try:
        response = model.generate_content(prompt)
        return {
            "original_content": request.content,
            "enhanced_content": response.text,
            "action": request.action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cv/analyze")
async def analyze_cv(cv_text: str):
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    prompt = f"""Analyze this CV and provide improvement suggestions:

{cv_text}

Provide:
1. Overall strengths
2. Areas to improve
3. ATS optimization tips
4. Content suggestions"""
    
    try:
        response = model.generate_content(prompt)
        return {
            "analysis": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# General AI Endpoints
@app.post("/generate")
async def generate_text(prompt: str):
    if not model:
        raise HTTPException(status_code=503, detail="AI service not configured")
    
    try:
        response = model.generate_content(prompt)
        return {
            "prompt": prompt,
            "generated_text": response.text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
