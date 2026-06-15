# InterviewAI Analytics

An AI-powered technical interview preparation platform with analytics-driven progress tracking, built as a final-year CS project.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, JWT auth, Google Gemini API, pandas/numpy
- **Frontend**: Vite, React, TypeScript, Tailwind CSS v4, Recharts
- **AI**: Gemini (resume parsing, question evaluation, coaching recommendations)

## Project Structure

```
interviewai-analytics/
├── backend/
│   ├── main.py              # FastAPI app entrypoint
│   ├── config.py            # settings (env vars)
│   ├── database.py          # SQLAlchemy engine/session
│   ├── models/               # ORM models (user, resume, interview, evaluation, analytics)
│   ├── schemas/               # Pydantic request/response models
│   ├── routes/                # API endpoints (auth, resume, interview, analytics, coach)
│   ├── services/               # business logic (auth, resume parsing, claude client, question bank)
│   ├── agents/                  # Claude-powered agents (question, evaluation, coach)
│   ├── analytics/                # pandas-based aggregation (dashboard, heatmap, skill gaps)
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/             # Login, Register, Dashboard, Interview*, Analytics, Resume, Coach, Settings
│   │   ├── components/         # layout (Sidebar/Navbar/AppShell), Badge, StatCard, ActivityHeatmap, ScoreBar
│   │   ├── hooks/               # useAuth
│   │   └── api/                  # axios client + TS types
└── database/
    └── interviewai.db          # SQLite (created automatically on first run)
```

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt --break-system-packages

# Create .env in backend/
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "GEMINI_API_KEY=your-gemini-api-key" >> .env

uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. The SQLite database and tables are created automatically on first startup.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and is configured (via `.env`) to talk to the backend at `http://localhost:8000`.

## Core Features

1. **Auth** — register/login/JWT, edit profile (target role, experience level)
2. **Resume Upload** — PDF upload, Claude-based extraction of skills/projects/experience
3. **AI Question Generator** — 40-question curated bank across 6 domains (AI/ML, Backend, DSA, DBMS, OOP, System Design), with resume-based domain suggestion and repeat-avoidance
4. **AI Evaluation Engine** — Claude scores answers on accuracy, depth, clarity, structure → weighted overall score + feedback, suggestions, missing concepts
5. **Analytics Dashboard** — readiness score, weekly trends, domain performance, skill distribution radar, GitHub-style activity heatmap
6. **Skill Gap Analysis** — auto-classifies domains as strong/moderate/weak based on rolling averages
7. **AI Coach** — personalized focus areas and study recommendations based on skill gaps + recent feedback

## Notes for Demo / Viva

- All four evaluation dimensions are weighted: accuracy 35%, depth 25%, clarity 20%, structure 20% (`agents/evaluation_agent.py`)
- Skill strength thresholds: ≥75 = strong, <50 = weak, else moderate (`analytics/skill_gap.py`)
- Readiness score blends recent (last 5 sessions, 60%) and overall (40%) averages (`analytics/aggregator.py`)
- The question bank is intentionally curated rather than fully AI-generated for consistency; could be extended to hybrid AI-generation as a future enhancement
- No Kafka/Kubernetes/microservices — single FastAPI app + SQLite, realistic for a student project but with a clean separation of concerns (models/services/agents/analytics) that maps well to interview discussion
