from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.analytics import SkillGap
from models.interview import InterviewSession
from models.evaluation import Evaluation
from services.deps import get_current_user
from agents.coach_agent import generate_coaching

router = APIRouter(prefix="/coach", tags=["coach"])


@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    gaps = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).all()
    strong = [g.topic for g in gaps if g.strength_level == "strong"]
    moderate = [g.topic for g in gaps if g.strength_level == "moderate"]
    weak = [g.topic for g in gaps if g.strength_level == "weak"]

    recent_evaluations = (
        db.query(Evaluation)
        .join(InterviewSession, InterviewSession.id == Evaluation.session_id)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(Evaluation.created_at.desc())
        .limit(5)
        .all()
    )
    recent_feedback = [e.feedback_text for e in recent_evaluations]

    return generate_coaching(
        strong_topics=strong,
        moderate_topics=moderate,
        weak_topics=weak,
        recent_feedback=recent_feedback,
    )
