import json
import re

from services.gemini_client import generate_text

EVALUATION_PROMPT = """You are an expert technical interviewer evaluating a candidate's answer.

Question (Domain: {domain}, Difficulty: {difficulty}):
{question}

Expected keywords/concepts a strong answer might touch on: {keywords}

Candidate's Answer:
---
{answer}
---

Evaluate the answer on these four dimensions, each scored 0-100:
- accuracy: Is the technical content correct?
- depth: Does it go beyond surface-level, showing real understanding?
- clarity: Is it explained clearly and understandably?
- structure: Is the answer well-organized (e.g. intro, explanation, example/conclusion)?

Also identify:
- which of the expected keywords/concepts were actually addressed (detected_keywords)
- missing_concepts: important concepts the candidate did not mention
- suggestions: 2-4 short, actionable suggestions for improvement
- feedback: a 2-4 sentence overall feedback summary, written directly to the candidate ("You explained...")

Return ONLY a valid JSON object with this exact shape, and nothing else (no markdown fences, no preamble):

{{
  "accuracy_score": <number 0-100>,
  "depth_score": <number 0-100>,
  "clarity_score": <number 0-100>,
  "structure_score": <number 0-100>,
  "detected_keywords": ["..."],
  "missing_concepts": ["..."],
  "suggestions": ["..."],
  "feedback": "..."
}}

If the answer is empty, off-topic, or just says "I don't know", score all dimensions low (0-20) and reflect that honestly in the feedback.
"""

# Weights for combining the four dimension scores into an overall score
WEIGHTS = {
    "accuracy": 0.35,
    "depth": 0.25,
    "clarity": 0.20,
    "structure": 0.20,
}


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def evaluate_answer(question: str, answer: str, domain: str, difficulty: str, keywords: list[str]) -> dict:
    """
    Call Claude to evaluate a candidate's answer.

    Returns a dict with accuracy_score, depth_score, clarity_score, structure_score,
    overall_score, detected_keywords, missing_concepts, suggestions, feedback.
    """
    prompt = EVALUATION_PROMPT.format(
        domain=domain,
        difficulty=difficulty,
        question=question,
        keywords=", ".join(keywords),
        answer=answer.strip() if answer else "(no answer provided)",
    )

    raw_text = generate_text(prompt, max_tokens=1000)
    cleaned = _strip_json_fences(raw_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        data = {
            "accuracy_score": 0,
            "depth_score": 0,
            "clarity_score": 0,
            "structure_score": 0,
            "detected_keywords": [],
            "missing_concepts": keywords,
            "suggestions": ["The evaluation could not be completed automatically. Please try again."],
            "feedback": "We couldn't generate detailed feedback for this answer. Please try submitting again.",
        }

    accuracy = float(data.get("accuracy_score", 0))
    depth = float(data.get("depth_score", 0))
    clarity = float(data.get("clarity_score", 0))
    structure = float(data.get("structure_score", 0))

    overall = (
        accuracy * WEIGHTS["accuracy"]
        + depth * WEIGHTS["depth"]
        + clarity * WEIGHTS["clarity"]
        + structure * WEIGHTS["structure"]
    )

    return {
        "accuracy_score": accuracy,
        "depth_score": depth,
        "clarity_score": clarity,
        "structure_score": structure,
        "overall_score": round(overall, 2),
        "detected_keywords": data.get("detected_keywords", []),
        "missing_concepts": data.get("missing_concepts", []),
        "suggestions": data.get("suggestions", []),
        "feedback": data.get("feedback", ""),
    }
