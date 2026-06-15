import json
import re

from pypdf import PdfReader

from services.gemini_client import generate_text

EXTRACTION_PROMPT = """You are a resume parser. Given the raw text of a resume, extract structured information.

Return ONLY a valid JSON object with this exact shape, and nothing else (no markdown fences, no preamble):

{{
  "skills": ["skill1", "skill2", ...],
  "projects": [
    {{"name": "...", "description": "...", "tech": ["...", "..."]}}
  ],
  "experience": [
    {{"role": "...", "company": "...", "duration": "..."}}
  ]
}}

Rules:
- skills should be a flat list of technical skills, languages, frameworks, and tools mentioned anywhere in the resume.
- projects should include academic, personal, and professional projects, each with a short 1-2 sentence description and a list of technologies used.
- experience should include internships, jobs, and relevant simulations/programs. If none exist, return an empty list.
- Do not fabricate information that isn't present in the resume text.

Resume text:
---
{resume_text}
---
"""


def extract_text_from_pdf(file_path: str) -> str:
    """Extract raw text from a PDF resume."""
    reader = PdfReader(file_path)
    text_parts = []
    for page in reader.pages:
        text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts).strip()


def _strip_json_fences(text: str) -> str:
    """Remove markdown code fences if Claude wraps the JSON despite instructions."""
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def parse_resume_with_claude(resume_text: str) -> dict:
    """Send resume text to Gemini and get back structured skills/projects/experience."""
    raw_text = generate_text(EXTRACTION_PROMPT.format(resume_text=resume_text), max_tokens=2000)
    cleaned = _strip_json_fences(raw_text)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError:
        # Fallback: return empty structure rather than crashing the request
        data = {"skills": [], "projects": [], "experience": []}

    return {
        "skills": data.get("skills", []),
        "projects": data.get("projects", []),
        "experience": data.get("experience", []),
    }
