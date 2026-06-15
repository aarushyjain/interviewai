from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class InterviewStartRequest(BaseModel):
    domain: Optional[str] = None       # if not provided, suggested from resume skills
    difficulty: str = "Medium"


class InterviewStartResponse(BaseModel):
    session_id: int
    domain: str
    difficulty: str
    question: str
    keywords: List[str]
    started_at: datetime


class InterviewSubmitRequest(BaseModel):
    answer: str
    duration_seconds: Optional[int] = None


class EvaluationOut(BaseModel):
    accuracy_score: float
    depth_score: float
    clarity_score: float
    structure_score: float
    overall_score: float
    feedback_text: str
    suggestions: List[str]
    missing_concepts: List[str]

    class Config:
        from_attributes = True


class InterviewSessionOut(BaseModel):
    id: int
    domain: str
    difficulty: str
    question_text: str
    user_answer: Optional[str] = None
    keywords_detected: List[str]
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    evaluation: Optional[EvaluationOut] = None

    class Config:
        from_attributes = True
