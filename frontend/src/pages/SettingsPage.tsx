import { useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../hooks/useAuth";

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [targetRole, setTargetRole] = useState(user?.target_role || "");
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || "Beginner");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await api.put("/auth/me", { name, target_role: targetRole, experience_level: experienceLevel });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage your profile.</p>
      </div>

      <div className="card p-5 flex flex-col gap-4">
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Email</label>
          <input
            value={user?.email || ""}
            disabled
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-2 text-sm text-[var(--color-text-muted)]"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Target Role</label>
          <input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. AI/ML Intern"
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">Experience Level</label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          >
            {EXPERIENCE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-[var(--color-primary)] py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
