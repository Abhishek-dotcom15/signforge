import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

export const userApi = {
  updateProfile: async (data: {
    fullName?: string;
    displayName?: string;
    locale?: "en" | "hi";
    theme?: "light" | "dark" | "system";
    isDeaf?: boolean;
    onboardingDone?: boolean;
  }) => {
    const { data: res } = await apiClient.put<User>("/user/profile", data);
    return res;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const { data: res } = await apiClient.put<{ message: string }>("/user/password", data);
    return res;
  },
};
