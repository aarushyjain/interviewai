from datetime import datetime, timedelta

import pandas as pd
from sqlalchemy.orm import Session

from models.interview import InterviewSession
from models.evaluation import Evaluation


def get_activity_heatmap(db: Session, user_id: int, days: int = 365) -> list[dict]:
    """
    Returns a list of {date, count, avg_score} for each day with completed
    interview activity in the last `days` days. Days with no activity are
    omitted (the frontend fills in blanks for a GitHub-style heatmap).
    """
    cutoff = datetime.utcnow() - timedelta(days=days)

    rows = (
        db.query(
            InterviewSession.completed_at,
            Evaluation.overall_score,
        )
        .join(Evaluation, Evaluation.session_id == InterviewSession.id)
        .filter(
            InterviewSession.user_id == user_id,
            InterviewSession.completed_at >= cutoff,
        )
        .all()
    )

    if not rows:
        return []

    df = pd.DataFrame(rows, columns=["completed_at", "overall_score"])
    df["date"] = pd.to_datetime(df["completed_at"]).dt.strftime("%Y-%m-%d")

    grouped = (
        df.groupby("date")
        .agg(count=("overall_score", "count"), avg_score=("overall_score", "mean"))
        .reset_index()
    )

    return [
        {
            "date": row["date"],
            "count": int(row["count"]),
            "avg_score": round(row["avg_score"], 2),
        }
        for _, row in grouped.iterrows()
    ]
