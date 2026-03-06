import { apiClient } from "@/lib/api-client";

interface InstitutionSummary {
  id: string;
  name: string;
  type: string;
  role: string;
}

interface ClassSummary {
  id: string;
  name: string;
  joinCode?: string;
}

interface ClassesResponse {
  teaching: ClassSummary[];
  enrolled: ClassSummary[];
}

interface AssignmentSummary {
  id: string;
  title: string;
  type: string;
  dueDate: string | null;
}

export const educationApi = {
  listInstitutions: async () => {
    const { data } = await apiClient.get<InstitutionSummary[]>("/education/institutions");
    return data;
  },

  createInstitution: async (body: { name: string; type?: string }) => {
    const { data } = await apiClient.post<{ id: string; name: string }>("/education/institutions", body);
    return data;
  },

  listClasses: async () => {
    const { data } = await apiClient.get<ClassesResponse>("/education/classes");
    return data;
  },

  createClass: async (body: { institutionId: string; name: string; description?: string }) => {
    const { data } = await apiClient.post<ClassSummary>("/education/classes", body);
    return data;
  },

  joinClass: async (joinCode: string) => {
    const { data } = await apiClient.post<{ message: string; className: string }>("/education/classes/join", { joinCode });
    return data;
  },

  listAssignments: async (classId: string) => {
    const { data } = await apiClient.get<AssignmentSummary[]>(`/education/classes/${classId}/assignments`);
    return data;
  },
};
