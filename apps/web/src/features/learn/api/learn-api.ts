import { apiClient } from "@/lib/api-client";

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lessonsTotal: number;
  lessonsCompleted: number;
  isLocked: boolean;
  category: string;
}

export interface LearningStats {
  totalLessons: number;
  completedLessons: number;
  streakDays: number;
  signsLearned: number;
}

export const learnApi = {
  getModules: async () => {
    const res = await apiClient.get<LearningModule[]>("/learn/modules");
    return res.data;
  },
  getStats: async () => {
    const res = await apiClient.get<LearningStats>("/learn/stats");
    return res.data;
  },
};
