import { useEffect, useState } from "react";
import { Sparkles, Target, BookOpen } from "lucide-react";
import { api } from "../api/client";
import type { CoachRecommendations } from "../api/types";

export function CoachPage() {
  const [data, setData] = useState<CoachRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<CoachRecommendations>("/coach/recommendations")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--color-primary)]" />
          AI Coach
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Personalized study recommendations based on your practice history.
        </p>
      </div>

      {loading ? (
        <div className="text-sm text-[var(--color-text-secondary)]">Generating your study plan...</div>
      ) : !data ? (
        <div className="text-sm text-[var(--color-text-secondary)]">Could not load recommendations.</div>
      ) : (
        <>
          <div className="card p-4">
            <p className="text-sm text-[var(--color-text-primary)]">{data.summary}</p>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target size={15} className="text-[var(--color-primary)]" />
              Focus Areas
            </h3>
            {data.focus_areas.length ? (
              <div className="flex flex-col gap-3">
                {data.focus_areas.map((f, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] last:border-0 pb-2 last:pb-0">
                    <span className="badge border-[var(--color-primary)]/30 text-[var(--color-primary)] bg-[var(--color-primary)]/10">
                      {f.topic}
                    </span>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1.5">{f.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[var(--color-text-muted)]">
                Complete a few sessions to get focus area recommendations.
              </span>
            )}
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <BookOpen size={15} className="text-[var(--color-primary)]" />
              Recommended Actions
            </h3>
            <ul className="flex flex-col gap-2">
              {data.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-[var(--color-text-secondary)] flex gap-2">
                  <span className="text-[var(--color-primary)]">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
