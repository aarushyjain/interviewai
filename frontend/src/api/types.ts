export interface User {
  id: number;
  name: string;
  email: string;
  target_role: string | null;
  experience_level: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Resume {
  id: number;
  extracted_skills: string[];
  extracted_projects: { name: string; description: string; tech: string[] }[];
  extracted_experience: { role: string; company: string; duration: string }[];
  parsed_at: string;
}

export interface DashboardSummary {
  readiness_score: number;
  total_interviews: number;
  avg_score: number;
  weekly_progress: { week_start: string; avg_score: number; total_interviews: number }[];
  domain_scores: Record<string, number>;
}

export interface HeatmapEntry {
  date: string;
  count: number;
  avg_score: number;
}

export interface SkillGapsResponse {
  strong_topics: string[];
  moderate_topics: string[];
  weak_topics: string[];
  details: { topic: string; strength_level: string; avg_score: number; evaluation_count: number }[];
}

export interface CoachRecommendations {
  summary: string;
  focus_areas: { topic: string; reason: string }[];
  recommendations: string[];
}

export interface InterviewStartResponse {
  session_id: number;
  domain: string;
  difficulty: string;
  question: string;
  keywords: string[];
  started_at: string;
}

export interface Evaluation {
  accuracy_score: number;
  depth_score: number;
  clarity_score: number;
  structure_score: number;
  overall_score: number;
  feedback_text: string;
  suggestions: string[];
  missing_concepts: string[];
}

export interface InterviewSession {
  id: number;
  domain: string;
  difficulty: string;
  question_text: string;
  user_answer: string | null;
  keywords_detected: string[];
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  evaluation: Evaluation | null;
}

export const DOMAINS = ["AI/ML", "Backend", "DSA", "DBMS", "OOP", "System Design"] as const;
export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
