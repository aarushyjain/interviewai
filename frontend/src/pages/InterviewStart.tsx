import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { api } from "../api/client";
import { DOMAINS, DIFFICULTIES, type InterviewStartResponse, type Resume } from "../api/types";
import { difficultyVariant } from "../components/Badge";

export function InterviewStart() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState<string | "">("");
  const [difficulty, setDifficulty] = useState<string>("Medium");
  const [suggestedDomain, setSuggestedDomain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Resume>("/resume/me")
      .then((res) => {
        if (res.data.extracted_skills?.length) {
          // Just a hint shown to the user; backend computes the real suggestion if domain is omitted
          setSuggestedDomain("based on your resume");
        }
      })
      .catch(() => {});
  }, []);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<InterviewStartResponse>("/interview/start", {
        domain: domain || undefined,
        difficulty,
      });
      navigate(`/interview/session/${res.data.session_id}`, { state: res.data });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold tracking-tight mb-1">Start a Practice Interview</h1>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Pick a domain and difficulty, or leave domain empty to get a question based on your resume.
      </p>

      <div className="card p-5 flex flex-col gap-5">
        <div>
          <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block">
            Domain {suggestedDomain && <span className="text-[var(--color-text-muted)]">({suggestedDomain} available)</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDomain("")}
              className={`badge cursor-pointer ${
                domain === "" ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10" : ""
              }`}
            >
              Auto (resume-based)
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`badge cursor-pointer ${
                  domain === d ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10" : ""
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`badge cursor-pointer ${
                  difficulty === d ? `border-current ${difficultyVariant(d) === "success" ? "text-[var(--color-success)]" : difficultyVariant(d) === "warning" ? "text-[var(--color-warning)]" : "text-[var(--color-danger)]"}` : ""
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

        <button
          onClick={handleStart}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] py-2.5 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Play size={15} />
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </div>
    </div>
  );
}
