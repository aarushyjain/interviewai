from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    domain = Column(String, nullable=False)        # "Backend", "DSA", "DBMS", "AI/ML", "OOP", "System Design"
    difficulty = Column(String, nullable=False)    # "Easy", "Medium", "Hard"

    question_text = Column(String, nullable=False)
    user_answer = Column(String, nullable=True)

    keywords_detected = Column(JSON, default=list)  # keywords found in the user's answer

    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, nullable=True)

    user = relationship("User", back_populates="interview_sessions")
    evaluation = relationship(
        "Evaluation", back_populates="session", uselist=False, cascade="all, delete-orphan"
    )
