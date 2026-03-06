import { apiClient } from "@/lib/api-client";
import type { ApiKey } from "@/types";

interface CreateKeyResponse {
  id: string;
  key: string;
  prefix: string;
  message: string;
}

interface UsageResponse {
  totalRequests: number;
  avgResponseMs: number;
  period: string;
}

interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
}

export const developerApi = {
  listApiKeys: async () => {
    const { data } = await apiClient.get<ApiKey[]>("/developer/api-keys");
    return data;
  },

  createApiKey: async (body: { name: string; scopes?: string[] }) => {
    const { data } = await apiClient.post<CreateKeyResponse>("/developer/api-keys", body);
    return data;
  },

  revokeApiKey: async (keyId: string) => {
    await apiClient.delete(`/developer/api-keys/${keyId}`);
  },

  getUsage: async () => {
    const { data } = await apiClient.get<UsageResponse>("/developer/usage");
    return data;
  },

  listWebhooks: async () => {
    const { data } = await apiClient.get<WebhookResponse[]>("/developer/webhooks");
    return data;
  },

  createWebhook: async (body: { url: string; events?: string[] }) => {
    const { data } = await apiClient.post<{ id: string; secret: string }>("/developer/webhooks", body);
    return data;
  },
};
