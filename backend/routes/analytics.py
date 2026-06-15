from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.analytics import SkillGap
from services.deps import get_current_user
from analytics.aggregator import get_dashboard_summary
from analytics.heatmap import get_activity_heatmap

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_dashboard_summary(db, current_user.id)


@router.get("/heatmap")
def heatmap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_activity_heatmap(db, current_user.id)


@router.get("/skill-gaps")
def skill_gaps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()

    strong = [g.topic for g in gaps if g.strength_level == "strong"]
    moderate = [g.topic for g in gaps if g.strength_level == "moderate"]
    weak = [g.topic for g in gaps if g.strength_level == "weak"]

    return {
        "strong_topics": strong,
        "moderate_topics": moderate,
        "weak_topics": weak,
        "details": [
            {
                "topic": g.topic,
                "strength_level": g.strength_level,
                "avg_score": g.avg_score,
                "evaluation_count": g.evaluation_count,
            }
            for g in gaps
        ],
    }
