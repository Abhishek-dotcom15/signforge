import { apiClient } from "@/lib/api-client";

interface AuditJobResponse {
  id: string;
  url: string;
  status: string;
  score: number | null;
  pagesScanned: number;
  createdAt: string;
}

interface AuditDetailResponse extends AuditJobResponse {
  summary: string | null;
  report: Record<string, unknown> | null;
  issues: {
    id: string;
    severity: string;
    category: string;
    wcagCriterion: string | null;
    description: string;
    recommendation: string | null;
    pageUrl: string | null;
  }[];
}

export const auditApi = {
  createJob: async (url: string, config?: Record<string, unknown>) => {
    const { data } = await apiClient.post<{ id: string; status: string }>("/audit/jobs", { url, config });
    return data;
  },

  listJobs: async (params?: { page?: number; perPage?: number }) => {
    const { data } = await apiClient.get<{ data: AuditJobResponse[]; total: number; page: number }>("/audit/jobs", { params });
    return data;
  },

  getJob: async (jobId: string) => {
    const { data } = await apiClient.get<AuditDetailResponse>(`/audit/jobs/${jobId}`);
    return data;
  },
};
