from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id"), unique=True, nullable=False)

    # Four weighted dimensions (0-100 each)
    accuracy_score = Column(Float, nullable=False)
    depth_score = Column(Float, nullable=False)
    clarity_score = Column(Float, nullable=False)
    structure_score = Column(Float, nullable=False)

    overall_score = Column(Float, nullable=False)  # weighted combination

    feedback_text = Column(String, nullable=False)
    suggestions = Column(JSON, default=list)         # ["Mention time complexity", ...]
    missing_concepts = Column(JSON, default=list)    # ["Indexing", "Connection pooling", ...]

    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="evaluation")
