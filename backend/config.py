import os
from dotenv import load_dotenv

import os
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DB_PATH = os.path.join(os.path.dirname(BASE_DIR), "database", "interviewai.db")


class Settings:
    PROJECT_NAME: str = "InterviewAI Analytics"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

    # Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-lite")

    # CORS
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


settings = Settings()
