from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    raw_text = Column(String, nullable=False)

    # Structured data extracted via Claude
    extracted_skills = Column(JSON, default=list)       # ["Python", "FastAPI", "SQL", ...]
    extracted_projects = Column(JSON, default=list)     # [{"name": ..., "description": ..., "tech": [...]}]
    extracted_experience = Column(JSON, default=list)   # [{"role": ..., "company": ..., "duration": ...}]

    parsed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="resume")
