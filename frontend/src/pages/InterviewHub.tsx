import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Clock } from "lucide-react";
import { api } from "../api/client";
import { Badge, difficultyVariant } from "../components/Badge";
import type { InterviewSession } from "../api/types";

export function InterviewHub() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<InterviewSession[]>("/interview/")
      .then((res) => setSessions(res.data))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Interviews</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Your practice session history.
          </p>
        </div>
        <Link
          to="/interview/start"
          className="flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity"
        >
          <Play size={15} />
          New Interview
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-[var(--color-text-secondary)]">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-[var(--color-text-secondary)]">
            No interview sessions yet. Start your first one above.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-text-secondary)]">
                <th className="px-4 py-2.5 font-medium">Question</th>
                <th className="px-4 py-2.5 font-medium">Domain</th>
                <th className="px-4 py-2.5 font-medium">Difficulty</th>
                <th className="px-4 py-2.5 font-medium">Score</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/interview/session/${s.id}`)}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 max-w-xs truncate">{s.question_text}</td>
                  <td className="px-4 py-3">
                    <Badge variant="primary">{s.domain}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={difficultyVariant(s.difficulty)}>{s.difficulty}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {s.evaluation ? (
                      <span
                        className="font-medium"
                        style={{
                          color:
                            s.evaluation.overall_score >= 75
                              ? "var(--color-success)"
                              : s.evaluation.overall_score >= 50
                              ? "var(--color-warning)"
                              : "var(--color-danger)",
                        }}
                      >
                        {s.evaluation.overall_score.toFixed(0)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                        <Clock size={12} />
                        In progress
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{formatDate(s.started_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
