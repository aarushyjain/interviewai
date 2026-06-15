import os
import tempfile

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.resume import Resume
from schemas.resume import ResumeOut
from services.deps import get_current_user
from services.resume_parser import extract_text_from_pdf, parse_resume_with_claude

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/upload", response_model=ResumeOut)
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if file.content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Save to a temp file so pypdf can read it
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(file.file.read())
        tmp_path = tmp.name

    try:
        raw_text = extract_text_from_pdf(tmp_path)
        if not raw_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        extracted = parse_resume_with_claude(raw_text)
    finally:
        os.remove(tmp_path)

    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if resume:
        resume.raw_text = raw_text
        resume.extracted_skills = extracted["skills"]
        resume.extracted_projects = extracted["projects"]
        resume.extracted_experience = extracted["experience"]
    else:
        resume = Resume(
            user_id=current_user.id,
            raw_text=raw_text,
            extracted_skills=extracted["skills"],
            extracted_projects=extracted["projects"],
            extracted_experience=extracted["experience"],
        )
        db.add(resume)

    db.commit()
    db.refresh(resume)
    return resume


@router.get("/me", response_model=ResumeOut)
def get_my_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="No resume uploaded yet")
    return resume
