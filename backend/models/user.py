from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    target_role = Column(String, nullable=True)       # e.g. "Backend Developer Intern"
    experience_level = Column(String, nullable=True)  # e.g. "Beginner", "Intermediate"

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    resume = relationship("Resume", back_populates="user", uselist=False, cascade="all, delete-orphan")
    interview_sessions = relationship("InterviewSession", back_populates="user", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="user", cascade="all, delete-orphan")
    weekly_snapshots = relationship("WeeklySnapshot", back_populates="user", cascade="all, delete-orphan")
