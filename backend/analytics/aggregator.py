from datetime import datetime, timedelta

import pandas as pd
from sqlalchemy.orm import Session

from models.interview import InterviewSession
from models.evaluation import Evaluation


def _sessions_dataframe(db: Session, user_id: int) -> pd.DataFrame:
    """Load all completed sessions + evaluations for a user into a DataFrame."""
    rows = (
        db.query(
            InterviewSession.id,
            InterviewSession.domain,
            InterviewSession.started_at,
            InterviewSession.completed_at,
            Evaluation.overall_score,
        )
        .join(Evaluation, Evaluation.session_id == InterviewSession.id)
        .filter(InterviewSession.user_id == user_id)
        .all()
    )

    if not rows:
        return pd.DataFrame(columns=["id", "domain", "started_at", "completed_at", "overall_score"])

    return pd.DataFrame(rows, columns=["id", "domain", "started_at", "completed_at", "overall_score"])


def get_dashboard_summary(db: Session, user_id: int) -> dict:
    """
    Compute headline dashboard stats:
    - readiness_score: overall average, weighted slightly toward recent sessions
    - total_interviews
    - avg_score
    - weekly_progress: list of {week_start, avg_score, total_interviews} for last 8 weeks
    - domain_scores: {domain: avg_score}
    """
    df = _sessions_dataframe(db, user_id)

    if df.empty:
        return {
            "readiness_score": 0,
            "total_interviews": 0,
            "avg_score": 0,
            "weekly_progress": [],
            "domain_scores": {},
        }

    total_interviews = len(df)
    avg_score = round(df["overall_score"].mean(), 2)

    # Readiness score: weight recent sessions more heavily (last 5 vs overall)
    recent = df.sort_values("completed_at", ascending=False).head(5)
    recent_avg = recent["overall_score"].mean()
    readiness_score = round((0.6 * recent_avg) + (0.4 * avg_score), 2)

    domain_scores = (
        df.groupby("domain")["overall_score"].mean().round(2).to_dict()
    )

    # Weekly progress for the last 8 weeks
    df["completed_at"] = pd.to_datetime(df["completed_at"])
    df["week_start"] = df["completed_at"].dt.to_period("W").dt.start_time

    weekly = (
        df.groupby("week_start")
        .agg(avg_score=("overall_score", "mean"), total_interviews=("id", "count"))
        .reset_index()
        .sort_values("week_start")
        .tail(8)
    )

    weekly_progress = [
        {
            "week_start": row["week_start"].strftime("%Y-%m-%d"),
            "avg_score": round(row["avg_score"], 2),
            "total_interviews": int(row["total_interviews"]),
        }
        for _, row in weekly.iterrows()
    ]

    return {
        "readiness_score": readiness_score,
        "total_interviews": total_interviews,
        "avg_score": avg_score,
        "weekly_progress": weekly_progress,
        "domain_scores": domain_scores,
    }
