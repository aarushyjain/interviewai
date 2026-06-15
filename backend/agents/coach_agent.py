import json
import re

from services.gemini_client import generate_text

COACH_PROMPT = """You are an AI interview coach helping a student prepare for technical interviews.

Here is the student's current skill profile based on their practice history:

Strong topics (avg score >= 75): {strong_topics}
Moderate topics: {moderate_topics}
Weak topics (avg score < 50): {weak_topics}

Recent feedback from their last few sessions:
{recent_feedback}

Based on this, provide:
- a short encouraging summary (2-3 sentences) of where they stand
- a prioritized list of 3-5 topics to focus on next, with a 1-sentence reason each
- 3-5 concrete learning resources or actions (e.g. "Practice 5 medium DSA problems on hashmaps", "Read about database indexing")

Return ONLY a valid JSON object with this exact shape, and nothing else (no markdown fences, no preamble):

{{
  "summary": "...",
  "focus_areas": [
    {{"topic": "...", "reason": "..."}}
  ],
  "recommendations": ["...", "..."]
}}
"""


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def generate_coaching(strong_topics: list[str], moderate_topics: list[str], weak_topics: list[str], recent_feedback: list[str]) -> dict:
    feedback_block = "\n".join(f"- {f}" for f in recent_feedback) if recent_feedback else "(no sessions completed yet)"

    prompt = COACH_PROMPT.format(
        strong_topics=", ".join(strong_topics) or "none yet",
        moderate_topics=", ".join(moderate_topics) or "none yet",
        weak_topics=", ".join(weak_topics) or "none yet",
        recent_feedback=feedback_block,
    )

    raw_text = generate_text(prompt, max_tokens=1000)
    cleaned = _strip_json_fences(raw_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        data = {
            "summary": "Keep practicing to build up your profile — once you've completed a few sessions, I can give tailored recommendations.",
            "focus_areas": [],
            "recommendations": [
                "Complete at least one practice interview in each domain to establish a baseline.",
            ],
        }

    return data
