from datetime import datetime
from typing import List, Dict, Any

from pydantic import BaseModel


class ResumeOut(BaseModel):
    id: int
    extracted_skills: List[str]
    extracted_projects: List[Dict[str, Any]]
    extracted_experience: List[Dict[str, Any]]
    parsed_at: datetime

    class Config:
        from_attributes = True
