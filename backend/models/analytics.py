from datetime import datetime

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship

from database import Base


class SkillGap(Base):
    """Per-user, per-topic rolling strength assessment, recomputed after each evaluation."""

    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(String, nullable=False)             # e.g. "DBMS", "System Design"
    strength_level = Column(String, nullable=False)    # "strong" | "moderate" | "weak"
    avg_score = Column(Float, nullable=False)
    evaluation_count = Column(Integer, default=0)

    last_updated = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="skill_gaps")


class WeeklySnapshot(Base):
    """Precomputed weekly rollup so the dashboard doesn't recompute from raw evaluations every load."""

    __tablename__ = "weekly_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    week_start = Column(Date, nullable=False)  # Monday of the week

    total_interviews = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    domain_scores = Column(JSON, default=dict)  # {"Backend": 78.5, "DSA": 62.0, ...}

    user = relationship("User", back_populates="weekly_snapshots")
