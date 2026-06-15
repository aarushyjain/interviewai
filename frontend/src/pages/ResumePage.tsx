import { useEffect, useRef, useState } from "react";
import { Upload, FileText, Briefcase, Code2 } from "lucide-react";
import { api } from "../api/client";
import type { Resume } from "../api/types";

export function ResumePage() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api
      .get<Resume>("/resume/me")
      .then((res) => setResume(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post<Resume>("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResume(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Resume</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Upload your resume to get personalized interview questions.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-bg)] hover:opacity-90 transition-opacity cursor-pointer">
          <Upload size={15} />
          {uploading ? "Uploading..." : resume ? "Re-upload PDF" : "Upload PDF"}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}

      {loading ? (
        <div className="text-sm text-[var(--color-text-secondary)]">Loading...</div>
      ) : !resume ? (
        <div className="card p-8 text-center flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center">
            <FileText size={22} className="text-[var(--color-primary)]" />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
            No resume uploaded yet. Upload a PDF to extract your skills, projects, and experience automatically.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Code2 size={15} className="text-[var(--color-primary)]" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {resume.extracted_skills.length ? (
                resume.extracted_skills.map((skill) => (
                  <span key={skill} className="badge">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">No skills extracted</span>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FileText size={15} className="text-[var(--color-primary)]" />
              Projects
            </h3>
            <div className="flex flex-col gap-3">
              {resume.extracted_projects.length ? (
                resume.extracted_projects.map((p, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] last:border-0 pb-3 last:pb-0">
                    <h4 className="text-sm font-medium">{p.name}</h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.tech?.map((t) => (
                        <span key={t} className="badge text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">No projects extracted</span>
              )}
            </div>
          </div>

          <div className="card p-4">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Briefcase size={15} className="text-[var(--color-primary)]" />
              Experience
            </h3>
            <div className="flex flex-col gap-2">
              {resume.extracted_experience.length ? (
                resume.extracted_experience.map((e, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{e.role}</span>
                      <span className="text-[var(--color-text-secondary)]"> @ {e.company}</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-secondary)]">{e.duration}</span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-[var(--color-text-muted)]">No experience extracted</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
