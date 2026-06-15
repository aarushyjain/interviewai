import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquareCode,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/interview", label: "Interviews", icon: MessageSquareCode },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/coach", label: "AI Coach", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-4">
      <div className="flex items-center gap-2 px-3 mb-6">
        <div className="h-7 w-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-bg)] font-bold text-sm">
          IA
        </div>
        <span className="font-semibold text-sm tracking-tight">InterviewAI</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
