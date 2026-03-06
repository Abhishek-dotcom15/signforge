import { apiClient } from "@/lib/api-client";
import type { Story, StoryProgress } from "@/types";

interface PaginatedStories {
  data: Story[];
  total: number;
  page: number;
  pages: number;
}

interface ChapterResponse {
  chapterNum: number;
  titleEn: string | null;
  contentEn: string;
  contentHi: string | null;
  islGlosses: string;
  sigmlSequence: unknown[];
}

interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  isAdaptive: boolean;
}

export const storiesApi = {
  list: async (params?: { page?: number; perPage?: number; theme?: string; difficulty?: string }) => {
    const { data } = await apiClient.get<PaginatedStories>("/stories", { params });
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<Story & { chapters: { chapterNum: number; titleEn: string }[] }>(`/stories/${id}`);
    return data;
  },

  getChapter: async (storyId: string, chapterNum: number) => {
    const { data } = await apiClient.get<ChapterResponse>(`/stories/${storyId}/chapters/${chapterNum}`);
    return data;
  },

  getProgress: async (storyId: string) => {
    const { data } = await apiClient.get<StoryProgress>(`/stories/${storyId}/progress`);
    return data;
  },

  updateProgress: async (storyId: string, progress: Partial<StoryProgress>) => {
    const { data } = await apiClient.put(`/stories/${storyId}/progress`, progress);
    return data;
  },

  listQuizzes: async (storyId: string) => {
    const { data } = await apiClient.get<QuizSummary[]>(`/stories/${storyId}/quizzes`);
    return data;
  },
};
