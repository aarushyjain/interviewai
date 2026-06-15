from google import genai
from google.genai import types

from config import settings

_client = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


def generate_text(prompt: str, max_tokens: int = 1000) -> str:
    """Send a prompt to Gemini and return the raw text response."""
    client = _get_client()

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            max_output_tokens=max_tokens,
            temperature=0.7,
        ),
    )
    return response.text or ""
