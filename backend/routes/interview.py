from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.resume import Resume
from models.interview import InterviewSession
from models.evaluation import Evaluation
from schemas.interview import (
    InterviewStartRequest,
    InterviewStartResponse,
    InterviewSubmitRequest,
    InterviewSessionOut,
)
from services.deps import get_current_user
from services.question_bank import DOMAINS, DIFFICULTIES
from agents.question_agent import pick_question, suggest_domain_from_skills
from agents.evaluation_agent import evaluate_answer
from analytics.skill_gap import recompute_skill_gaps

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/start", response_model=InterviewStartResponse)
def start_interview(
    payload: InterviewStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    domain = payload.domain
    difficulty = payload.difficulty

    if difficulty not in DIFFICULTIES:
        raise HTTPException(status_code=400, detail=f"difficulty must be one of {DIFFICULTIES}")

    if domain and domain not in DOMAINS:
        raise HTTPException(status_code=400, detail=f"domain must be one of {DOMAINS}")

    if not domain:
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        skills = resume.extracted_skills if resume else []
        domain = suggest_domain_from_skills(skills) if skills else "Backend"

    # Avoid repeating the user's last 5 questions in this domain
    recent_questions = [
        s.question_text
        for s in db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id, InterviewSession.domain == domain)
        .order_by(InterviewSession.started_at.desc())
        .limit(5)
        .all()
    ]

    q = pick_question(domain=domain, difficulty=difficulty, exclude_questions=recent_questions)

    session = InterviewSession(
        user_id=current_user.id,
        domain=q["domain"],
        difficulty=q["difficulty"],
        question_text=q["question"],
        keywords_detected=[],
        started_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return InterviewStartResponse(
        session_id=session.id,
        domain=session.domain,
        difficulty=session.difficulty,
        question=session.question_text,
        keywords=q["keywords"],
        started_at=session.started_at,
    )


@router.post("/{session_id}/submit", response_model=InterviewSessionOut)
def submit_answer(
    session_id: int,
    payload: InterviewSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")

    if session.completed_at is not None:
        raise HTTPException(status_code=400, detail="This session has already been submitted")

    # Look up the original question's expected keywords from the bank
    from services.question_bank import QUESTION_BANK

    keywords = []
    for q in QUESTION_BANK:
        if q["question"] == session.question_text:
            keywords = q["keywords"]
            break

    result = evaluate_answer(
        question=session.question_text,
        answer=payload.answer,
        domain=session.domain,
        difficulty=session.difficulty,
        keywords=keywords,
    )

    session.user_answer = payload.answer
    session.keywords_detected = result["detected_keywords"]
    session.completed_at = datetime.utcnow()
    session.duration_seconds = payload.duration_seconds

    evaluation = Evaluation(
        session_id=session.id,
        accuracy_score=result["accuracy_score"],
        depth_score=result["depth_score"],
        clarity_score=result["clarity_score"],
        structure_score=result["structure_score"],
        overall_score=result["overall_score"],
        feedback_text=result["feedback"],
        suggestions=result["suggestions"],
        missing_concepts=result["missing_concepts"],
    )
    db.add(evaluation)
    db.commit()
    db.refresh(session)

    # Recompute skill gaps in the background-ish (synchronously here, since it's cheap)
    recompute_skill_gaps(db, current_user.id)

    return session


@router.get("/{session_id}", response_model=InterviewSessionOut)
def get_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = (
        db.query(InterviewSession)
        .filter(InterviewSession.id == session_id, InterviewSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return session


@router.get("/", response_model=List[InterviewSessionOut])
def list_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(InterviewSession)
        .filter(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.started_at.desc())
        .all()
    )
