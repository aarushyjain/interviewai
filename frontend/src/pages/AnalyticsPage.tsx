import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { api } from "../api/client";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { Badge, strengthVariant } from "../components/Badge";
import type { DashboardSummary, HeatmapEntry, SkillGapsResponse } from "../api/types";

export function AnalyticsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<DashboardSummary>("/analytics/dashboard"),
      api.get<HeatmapEntry[]>("/analytics/heatmap"),
      api.get<SkillGapsResponse>("/analytics/skill-gaps"),
    ])
      .then(([dashRes, heatRes, gapsRes]) => {
        setSummary(dashRes.data);
        setHeatmap(heatRes.data);
        setSkillGaps(gapsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-[var(--color-text-secondary)]">Loading analytics...</div>;
  }

  const weeklyChartData = (summary?.weekly_progress || []).map((w) => ({
    week: w.week_start.slice(5),
    score: w.avg_score,
    interviews: w.total_interviews,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Deeper view into your progress over time.
        </p>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium mb-3">Weekly Score Trend</h3>
        {weeklyChartData.length === 0 ? (
          <p className="text-xs text-[var(--color-text-muted)]">No data yet — complete some interviews first.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium mb-3">Activity (last 6 months)</h3>
        <ActivityHeatmap data={heatmap} />
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-medium mb-3">Skill Breakdown</h3>
        {skillGaps?.details.length ? (
          <div className="flex flex-col gap-2">
            {skillGaps.details.map((d) => (
              <div key={d.topic} className="flex items-center justify-between border-b border-[var(--color-border)] last:border-0 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{d.topic}</span>
                  <Badge variant={strengthVariant(d.strength_level)}>{d.strength_level}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{d.avg_score.toFixed(1)}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{d.evaluation_count} sessions</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--color-text-muted)]">No skill data yet.</p>
        )}
      </div>
    </div>
  );
}
