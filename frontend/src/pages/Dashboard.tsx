import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { Target, ListChecks, TrendingUp, Award } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { StatCard } from "../components/StatCard";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { Badge, strengthVariant } from "../components/Badge";
import type { DashboardSummary, HeatmapEntry, SkillGapsResponse, CoachRecommendations } from "../api/types";

export function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapEntry[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGapsResponse | null>(null);
  const [coach, setCoach] = useState<CoachRecommendations | null>(null);
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

    // Coach call is separate/slower (LLM call) - don't block the rest of the dashboard
    api
      .get<CoachRecommendations>("/coach/recommendations")
      .then((res) => setCoach(res.data))
      .catch(() => {});
  }, []);

  if (loading) {
    return <div className="text-sm text-[var(--color-text-secondary)]">Loading dashboard...</div>;
  }

  const hasActivity = (summary?.total_interviews ?? 0) > 0;

  const domainChartData = Object.entries(summary?.domain_scores || {}).map(([domain, score]) => ({
    domain,
    score,
  }));

  const weeklyChartData = (summary?.weekly_progress || []).map((w) => ({
    week: w.week_start.slice(5), // MM-DD
    score: w.avg_score,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Here's how your interview prep is going.
        </p>
      </div>

      {!hasActivity ? (
        <div className="card p-8 flex flex-col items-center text-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center">
            <Target size={22} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="text-base font-semibold">No interviews yet</h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
            Start your first practice interview to see your readiness score, domain breakdown, and personalized
            recommendations here.
          </p>
          <Link
            to="/interview"
            className="mt-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity"
          >
            Start your first interview
          </Link>
        </div>
      ) : (
        <>
          {/* Row 1: Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Readiness Score" value={summary!.readiness_score} icon={Award} />
            <StatCard label="Total Interviews" value={summary!.total_interviews} icon={ListChecks} />
            <StatCard
              label="Weekly Progress"
              value={
                weeklyChartData.length > 0 ? weeklyChartData[weeklyChartData.length - 1].score : "—"
              }
              icon={TrendingUp}
            />
            <StatCard label="Average Score" value={summary!.avg_score} icon={Target} />
          </div>

          {/* Row 2: Domain performance + skill distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3">Domain Performance</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={domainChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="domain"
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
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3">Skill Distribution</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={domainChartData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                  <Radar
                    dataKey="score"
                    stroke="var(--color-primary)"
                    fill="var(--color-primary)"
                    fillOpacity={0.25}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Activity heatmap */}
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3">Activity</h3>
            <ActivityHeatmap data={heatmap} />
          </div>

          {/* Row 4: Weak topics, strong topics, AI recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3">Weak Topics</h3>
              <div className="flex flex-wrap gap-2">
                {skillGaps?.weak_topics.length ? (
                  skillGaps.weak_topics.map((t) => (
                    <Badge key={t} variant="danger">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[var(--color-text-muted)]">None identified yet</span>
                )}
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3">Strong Topics</h3>
              <div className="flex flex-wrap gap-2">
                {skillGaps?.strong_topics.length ? (
                  skillGaps.strong_topics.map((t) => (
                    <Badge key={t} variant="success">
                      {t}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-[var(--color-text-muted)]">None identified yet</span>
                )}
              </div>
              {skillGaps?.details.length ? (
                <div className="mt-3 flex flex-col gap-1">
                  {skillGaps.details.map((d) => (
                    <div key={d.topic} className="flex items-center justify-between text-xs">
                      <span className="text-[var(--color-text-secondary)]">{d.topic}</span>
                      <Badge variant={strengthVariant(d.strength_level)}>{d.avg_score.toFixed(0)}</Badge>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-medium mb-3">AI Recommendations</h3>
              {coach ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[var(--color-text-secondary)]">{coach.summary}</p>
                  <ul className="flex flex-col gap-1 mt-1">
                    {coach.recommendations.slice(0, 3).map((rec, i) => (
                      <li key={i} className="text-xs text-[var(--color-text-primary)] flex gap-2">
                        <span className="text-[var(--color-primary)]">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                  <Link to="/coach" className="text-xs text-[var(--color-primary)] hover:underline mt-1">
                    View full coaching plan →
                  </Link>
                </div>
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">Loading recommendations...</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
