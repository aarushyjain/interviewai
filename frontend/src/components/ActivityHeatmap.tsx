import type { HeatmapEntry } from "../api/types";

interface ActivityHeatmapProps {
  data: HeatmapEntry[];
  weeks?: number;
}

function getColor(avgScore: number, count: number): string {
  if (count === 0) return "var(--color-surface)";
  if (avgScore >= 80) return "var(--color-success)";
  if (avgScore >= 60) return "#2EA043";
  if (avgScore >= 40) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function ActivityHeatmap({ data, weeks = 26 }: ActivityHeatmapProps) {
  const map = new Map(data.map((d) => [d.date, d]));

  const days: { date: string; entry?: HeatmapEntry }[] = [];
  const today = new Date();

  // Align end to the most recent Saturday so columns line up cleanly
  const totalDays = weeks * 7;
  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, entry: map.get(dateStr) });
  }

  // Group into columns of 7 (weeks)
  const columns: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    columns.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {columns.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-1">
          {col.map(({ date, entry }) => (
            <div
              key={date}
              title={
                entry
                  ? `${date}: ${entry.count} session${entry.count > 1 ? "s" : ""}, avg ${entry.avg_score}`
                  : date
              }
              className="h-3 w-3 rounded-sm border border-[var(--color-border)]"
              style={{ backgroundColor: getColor(entry?.avg_score ?? 0, entry?.count ?? 0) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
