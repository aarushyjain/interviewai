import { Search, Bell } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 md:px-6">
      <div className="relative w-full max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <Bell size={18} />
        </button>

        <div className="group relative">
          <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-xs font-semibold text-[var(--color-bg)] cursor-pointer">
            {initials || "?"}
          </div>
          <div className="absolute right-0 mt-2 hidden w-40 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] py-1 text-sm shadow-lg group-hover:block">
            <div className="px-3 py-1.5 text-[var(--color-text-secondary)] text-xs border-b border-[var(--color-border)]">
              {user?.email}
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-3 py-1.5 hover:bg-[var(--color-surface-hover)] text-[var(--color-danger)]"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
