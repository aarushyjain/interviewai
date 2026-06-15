import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

export function StatCard({ label, value, icon: Icon, trend, trendPositive }: StatCardProps) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-secondary)] font-medium">{label}</span>
        <Icon size={16} className="text-[var(--color-text-muted)]" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-medium ${
              trendPositive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
