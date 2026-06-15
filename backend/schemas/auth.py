from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    target_role: Optional[str] = None
    experience_level: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    experience_level: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    target_role: Optional[str] = None
    experience_level: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
