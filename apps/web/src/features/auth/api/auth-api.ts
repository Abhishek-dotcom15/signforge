import { apiClient } from "@/lib/api-client";
import type { AuthResponse, User } from "@/types";

export const authApi = {
  register: async (data: { email: string; password: string; fullName: string; isDeaf?: boolean }) => {
    const { data: res } = await apiClient.post<AuthResponse>("/auth/register", data);
    return res;
  },

  login: async (data: { email: string; password: string }) => {
    const { data: res } = await apiClient.post<AuthResponse>("/auth/login", data);
    return res;
  },

  getMe: async () => {
    const { data: res } = await apiClient.get<User>("/auth/me");
    return res;
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  forgotPassword: async (email: string) => {
    const { data: res } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    return res;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data: res } = await apiClient.post<{ message: string }>("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
    return res;
  },
};
