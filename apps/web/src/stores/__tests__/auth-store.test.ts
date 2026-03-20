import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth-store";
import type { User } from "@/types";

const mockUser: User = {
  id: "user-1",
  email: "test@example.com",
  fullName: "Test User",
  displayName: "Test",
  locale: "en",
  theme: "system",
  isDeaf: false,
  isVerified: true,
  roles: ["general"],
  onboardingDone: true,
  createdAt: "2025-01-01T00:00:00Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
    localStorage.clear();
  });

  describe("initial state", () => {
    it("has null user", () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("is not authenticated", () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("is loading", () => {
      expect(useAuthStore.getState().isLoading).toBe(true);
    });
  });

  describe("setUser", () => {
    it("sets the user", () => {
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it("sets isAuthenticated to true", () => {
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
    });

    it("sets isLoading to false", () => {
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("clears the user", () => {
      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it("sets isAuthenticated to false", () => {
      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isAuthenticated).toBe(false);
    });

    it("sets isLoading to false", () => {
      useAuthStore.getState().setUser(mockUser);
      useAuthStore.getState().logout();
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("removes tokens from localStorage", () => {
      localStorage.setItem("access_token", "test-access");
      localStorage.setItem("refresh_token", "test-refresh");
      useAuthStore.getState().logout();
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });
  });

  describe("setLoading", () => {
    it("sets isLoading to true", () => {
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().setLoading(true);
      expect(useAuthStore.getState().isLoading).toBe(true);
    });

    it("sets isLoading to false", () => {
      useAuthStore.getState().setLoading(false);
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
