type BadgeVariant = "default" | "success" | "warning" | "danger" | "primary";

const variantClasses: Record<BadgeVariant, string> = {
  default: "text-[var(--color-text-secondary)] border-[var(--color-border)]",
  success: "text-[var(--color-success)] border-[var(--color-success)]/30 bg-[var(--color-success)]/10",
  warning: "text-[var(--color-warning)] border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10",
  danger: "text-[var(--color-danger)] border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10",
  primary: "text-[var(--color-primary)] border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10",
};

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return <span className={`badge ${variantClasses[variant]}`}>{children}</span>;
}

export function difficultyVariant(difficulty: string): BadgeVariant {
  if (difficulty === "Easy") return "success";
  if (difficulty === "Medium") return "warning";
  return "danger";
}

export function strengthVariant(level: string): BadgeVariant {
  if (level === "strong") return "success";
  if (level === "weak") return "danger";
  return "warning";
}
