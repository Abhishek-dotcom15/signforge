import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  translationsToday: number;
  signsLearned: number;
  storiesCompleted: number;
  streakDays: number;
}

export const dashboardApi = {
  getStats: async () => {
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats");
    return data;
  },
};
