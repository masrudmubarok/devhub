from pydantic import BaseModel, Field
from typing import Optional


class NoteEnhanceRequest(BaseModel):
    action: str = Field(..., description="Action to perform: summarize, improve, generate_doc, explain_code")
    content: str = Field(..., description="Content to enhance")


class CVEnhanceRequest(BaseModel):
    action: str = Field(..., description="Action: rewrite_summary, improve_experience, generate_skills, translate, suggest_title")
    content: str = Field(..., description="Content to enhance")
    cv_id: Optional[int] = Field(None, description="CV ID for context")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., description="Generation prompt")
    context: Optional[str] = Field(None, description="Additional context")


class EnhanceResponse(BaseModel):
    result: str
    action: str


class TagsResponse(BaseModel):
    tags: list[str]


class AnalysisResponse(BaseModel):
    analysis: dict
    suggestions: list[str]


class ErrorResponse(BaseModel):
    error: str
    message: str
