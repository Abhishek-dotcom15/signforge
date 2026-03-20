import { apiClient } from "@/lib/api-client";

export interface ServiceHealth {
  name: string;
  status: "healthy" | "unhealthy" | "unknown";
}

export interface ActivityItem {
  type: "user_registered" | "story_created";
  description: string;
  timestamp: string | null;
  meta: Record<string, string>;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSigns: number;
  totalStories: number;
  totalSigmlFiles: number;
  services: ServiceHealth[];
  recentActivity: ActivityItem[];
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export interface PaginatedUsers {
  data: AdminUser[];
  total: number;
  page: number;
  pages: number;
}

export const adminApi = {
  getStats: async () => {
    const { data } = await apiClient.get<AdminStats>("/admin/stats");
    return data;
  },
  listUsers: async (params?: { search?: string; page?: number; perPage?: number }) => {
    const { data } = await apiClient.get<PaginatedUsers>("/admin/users", { params });
    return data;
  },
  toggleUserActive: async (userId: string) => {
    const { data } = await apiClient.post<{ id: string; isActive: boolean }>(`/admin/users/${userId}/toggle-active`);
    return data;
  },
};
