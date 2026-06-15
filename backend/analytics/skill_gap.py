from datetime import datetime

from sqlalchemy.orm import Session
from sqlalchemy import func

from models.interview import InterviewSession
from models.evaluation import Evaluation
from models.analytics import SkillGap

STRONG_THRESHOLD = 75
WEAK_THRESHOLD = 50


def _classify(avg_score: float) -> str:
    if avg_score >= STRONG_THRESHOLD:
        return "strong"
    if avg_score < WEAK_THRESHOLD:
        return "weak"
    return "moderate"


def recompute_skill_gaps(db: Session, user_id: int) -> list[SkillGap]:
    """
    Recompute per-domain skill strength for a user based on all their
    completed evaluations. Upserts SkillGap rows.
    """
    rows = (
        db.query(
            InterviewSession.domain,
            func.avg(Evaluation.overall_score).label("avg_score"),
            func.count(Evaluation.id).label("count"),
        )
        .join(Evaluation, Evaluation.session_id == InterviewSession.id)
        .filter(InterviewSession.user_id == user_id)
        .group_by(InterviewSession.domain)
        .all()
    )

    existing = {
        sg.topic: sg for sg in db.query(SkillGap).filter(SkillGap.user_id == user_id).all()
    }

    updated = []
    for domain, avg_score, count in rows:
        avg_score = float(avg_score)
        strength = _classify(avg_score)

        if domain in existing:
            sg = existing[domain]
            sg.avg_score = avg_score
            sg.evaluation_count = count
            sg.strength_level = strength
            sg.last_updated = datetime.utcnow()
        else:
            sg = SkillGap(
                user_id=user_id,
                topic=domain,
                strength_level=strength,
                avg_score=avg_score,
                evaluation_count=count,
                last_updated=datetime.utcnow(),
            )
            db.add(sg)

        updated.append(sg)

    db.commit()
    return updated
