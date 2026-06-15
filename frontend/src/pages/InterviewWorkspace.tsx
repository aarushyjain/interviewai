import { useEffect, useRef, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { api } from "../api/client";
import { Badge, difficultyVariant } from "../components/Badge";
import { ScoreBar } from "../components/ScoreBar";
import type { InterviewStartResponse, InterviewSession } from "../api/types";

export function InterviewWorkspace() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const startData = location.state as InterviewStartResponse | undefined;

  const [question, setQuestion] = useState<InterviewStartResponse | null>(startData ?? null);
  const [answer, setAnswer] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<InterviewSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // If the page is loaded directly (no nav state), fetch session details for question text/etc.
  useEffect(() => {
    if (!question && sessionId) {
      api.get<InterviewSession>(`/interview/${sessionId}`).then((res) => {
        const s = res.data;
        if (s.completed_at && s.evaluation) {
          setResult(s);
        } else {
          setQuestion({
            session_id: s.id,
            domain: s.domain,
            difficulty: s.difficulty,
            question: s.question_text,
            keywords: [],
            started_at: s.started_at,
          });
        }
      });
    }
  }, [sessionId, question]);

  const detectedKeywords = (question?.keywords || []).filter((kw) =>
    answer.toLowerCase().includes(kw.toLowerCase())
  );

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    setSubmitting(true);
    setError(null);
    if (timerRef.current) window.clearInterval(timerRef.current);

    try {
      const res = await api.post<InterviewSession>(`/interview/${sessionId}/submit`, {
        answer,
        duration_seconds: elapsed,
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!question && !result) {
    return <div className="text-sm text-[var(--color-text-secondary)]">Loading question...</div>;
  }

  // ---- Results view (PR review style) ----
  if (result && result.evaluation) {
    const ev = result.evaluation;
    return (
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Evaluation Results</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="primary">{result.domain}</Badge>
              <Badge variant={difficultyVariant(result.difficulty)}>{result.difficulty}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold" style={{ color: ev.overall_score >= 75 ? "var(--color-success)" : ev.overall_score >= 50 ? "var(--color-warning)" : "var(--color-danger)" }}>
              {ev.overall_score.toFixed(0)}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">Overall Score</div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium mb-2">Question</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{result.question_text}</p>
        </div>

        <div className="card p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ScoreBar label="Accuracy" score={ev.accuracy_score} />
          <ScoreBar label="Depth" score={ev.depth_score} />
          <ScoreBar label="Clarity" score={ev.clarity_score} />
          <ScoreBar label="Structure" score={ev.structure_score} />
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[var(--color-primary)]" />
            Feedback
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)]">{ev.feedback_text}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Suggestions</h3>
            <ul className="flex flex-col gap-1.5">
              {ev.suggestions.map((s, i) => (
                <li key={i} className="text-xs text-[var(--color-text-secondary)] flex gap-2">
                  <span className="text-[var(--color-primary)]">+</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-2">Missing Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {ev.missing_concepts.length ? (
                ev.missing_concepts.map((c, i) => (
                  <Badge key={i} variant="warning">
                    {c}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">None — great coverage!</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/interview")}
          className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-[var(--color-surface)] transition-colors"
        >
          <RotateCcw size={15} />
          Practice another question
        </button>
      </div>
    );
  }

  // ---- Active workspace view ----
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] gap-4 h-full">
      {/* Left: Question panel */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="primary">{question!.domain}</Badge>
          <Badge variant={difficultyVariant(question!.difficulty)}>{question!.difficulty}</Badge>
        </div>
        <h2 className="text-sm font-medium leading-relaxed">{question!.question}</h2>
      </div>

      {/* Center: Answer editor */}
      <div className="card p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Your Answer</span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
            <Clock size={13} />
            {formatTime(elapsed)}
          </div>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="flex-1 min-h-[300px] resize-none rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting || !answer.trim()}
          className="rounded-md bg-[var(--color-primary)] py-2.5 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Evaluating..." : "Submit Answer"}
        </button>
      </div>

      {/* Right: Live analytics panel */}
      <div className="card p-4 flex flex-col gap-4">
        <div>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Timer</span>
          <div className="text-xl font-semibold mt-1">{formatTime(elapsed)}</div>
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">Word Count</span>
          <div className="text-xl font-semibold mt-1">
            {answer.trim() ? answer.trim().split(/\s+/).length : 0}
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block">
            Keywords Detected
          </span>
          <div className="flex flex-wrap gap-1.5">
            {question!.keywords.map((kw) => (
              <Badge key={kw} variant={detectedKeywords.includes(kw) ? "success" : "default"}>
                {kw}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
