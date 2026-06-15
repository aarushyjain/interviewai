from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
import models.user, models.resume, models.interview, models.evaluation, models.analytics  # noqa: F401
from routes import auth, resume, interview, analytics, coach

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def root():
    return {"status": "ok", "service": settings.PROJECT_NAME}


app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(analytics.router)
app.include_router(coach.router)
