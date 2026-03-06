// ============================================
// Core Domain Types
// ============================================

export type UserRole =
  | "super_admin"
  | "institution_admin"
  | "educator"
  | "student"
  | "developer"
  | "api_user"
  | "general";

export interface User {
  id: string;
  email: string;
  fullName: string;
  displayName?: string;
  avatarUrl?: string;
  locale: "en" | "hi";
  theme: "light" | "dark" | "system";
  isDeaf: boolean;
  isVerified: boolean;
  roles: UserRole[];
  onboardingDone: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// Translation Types
// ============================================

export interface TranslationRequest {
  text: string;
  sourceLang?: "en" | "hi" | "auto";
  outputFormat?: "sigml" | "gloss" | "json" | "mp4_url";
  avatarStyle?: "default" | "male" | "female" | "neutral";
  speed?: number;
}

export interface GlossMapping {
  word: string;
  index: number;
  gloss: string;
  mapped: boolean;
}

export interface TranslationResponse {
  translationId: string;
  sourceText: string;
  detectedLang: string;
  glosses: string[];
  sigmlUrls: string[];
  wordToGlossMap: GlossMapping[];
  confidence: number;
  fallbackUsed: boolean;
  signingDurationSec: number;
  cached: boolean;
}

// ============================================
// Sign & Dictionary Types
// ============================================

export interface Sign {
  id: string;
  englishWord: string;
  hindiWord?: string;
  gloss: string;
  hamnosysCode?: string;
  sigmlUrl?: string;
  videoUrl?: string;
  categories: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  examples: SignExample[];
  handshapeDesc?: string;
}

export interface SignExample {
  sentenceEn: string;
  sentenceHi?: string;
  islGloss: string;
}

// ============================================
// Story Types
// ============================================

export interface Story {
  id: string;
  titleEn: string;
  titleHi?: string;
  slug: string;
  summaryEn?: string;
  theme: "animal" | "human" | "wisdom" | "sacrifice" | "karmic";
  difficulty: "beginner" | "intermediate" | "advanced";
  durationMin?: number;
  wordCount?: number;
  chapterCount: number;
  thumbnailUrl?: string;
  viewCount: number;
}

export interface StoryChapter {
  chapterNum: number;
  titleEn?: string;
  contentEn: string;
  contentHi?: string;
  islGlosses: string;
  sigmlSequence: SigmlEntry[];
}

export interface SigmlEntry {
  gloss: string;
  sigmlUrl: string;
  wordIndex: number;
}

export interface StoryDetail extends Story {
  chapters: StoryChapter[];
  quizzes: { id: string; title: string; questionCount: number }[];
}

export interface StoryProgress {
  status: "not_started" | "in_progress" | "completed";
  currentChapter: number;
  completionPct: number;
  timeSpentSec: number;
}

// ============================================
// Education Types
// ============================================

export interface ClassRoom {
  id: string;
  name: string;
  grade?: string;
  subject?: string;
  inviteCode: string;
  educatorId: string;
  studentCount: number;
  isActive: boolean;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  description?: string;
  type: "story" | "vocabulary" | "quiz" | "practice";
  dueDate?: string;
  isAdaptive: boolean;
}

export interface QuizQuestion {
  id: string;
  type: "sign_to_word" | "sentence_to_sign" | "sequence_order";
  questionData: Record<string, unknown>;
  options: Record<string, unknown>[];
  difficulty: number;
}

// ============================================
// Developer Types
// ============================================

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export interface UsageStats {
  period: string;
  totalRequests: number;
  byEndpoint: Record<string, number>;
  avgLatencyMs: number;
  errorRate: number;
  quota: {
    plan: string;
    limit: number;
    used: number;
    remaining: number;
    resetsAt: string;
  };
}

// ============================================
// Audit Types
// ============================================

export interface AuditJob {
  id: string;
  status: "pending" | "running" | "completed" | "failed";
  score?: number;
  breakdown?: {
    islCoverage: number;
    wcag22: number;
    cognitiveLoad: number;
    visualContrast: number;
  };
  totalIssues: number;
  createdAt: string;
}

export interface AuditIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  filePath?: string;
  lineNumber?: number;
  description: string;
  suggestion?: string;
  autoFixable: boolean;
}

// ============================================
// API Response Wrapper
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    latencyMs: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
