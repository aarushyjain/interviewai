function colorForScore(score: number): string {
  if (score >= 75) return "var(--color-success)";
  if (score >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-medium" style={{ color: colorForScore(score) }}>
          {score.toFixed(0)}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-hover)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: colorForScore(score) }}
        />
      </div>
    </div>
  );
}
