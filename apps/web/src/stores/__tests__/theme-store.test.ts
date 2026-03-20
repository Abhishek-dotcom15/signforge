import { describe, it, expect, beforeEach } from "vitest";
import { useThemeStore } from "../theme-store";

describe("useThemeStore", () => {
  beforeEach(() => {
    // Reset store state
    useThemeStore.setState({
      theme: "system",
      resolvedTheme: "light",
    });
    // Clean up document classes
    document.documentElement.classList.remove("light", "dark");
  });

  describe("initial state", () => {
    it("has system as default theme", () => {
      expect(useThemeStore.getState().theme).toBe("system");
    });

    it("has a resolved theme", () => {
      const resolved = useThemeStore.getState().resolvedTheme;
      expect(["light", "dark"]).toContain(resolved);
    });
  });

  describe("setTheme", () => {
    it("sets theme to light", () => {
      useThemeStore.getState().setTheme("light");
      expect(useThemeStore.getState().theme).toBe("light");
      expect(useThemeStore.getState().resolvedTheme).toBe("light");
    });

    it("sets theme to dark", () => {
      useThemeStore.getState().setTheme("dark");
      expect(useThemeStore.getState().theme).toBe("dark");
      expect(useThemeStore.getState().resolvedTheme).toBe("dark");
    });

    it("sets theme to system", () => {
      useThemeStore.getState().setTheme("dark");
      useThemeStore.getState().setTheme("system");
      expect(useThemeStore.getState().theme).toBe("system");
      // resolvedTheme depends on matchMedia, which defaults to light in jsdom
      expect(["light", "dark"]).toContain(useThemeStore.getState().resolvedTheme);
    });

    it("applies light class to document element", () => {
      useThemeStore.getState().setTheme("light");
      expect(document.documentElement.classList.contains("light")).toBe(true);
      expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("applies dark class to document element", () => {
      useThemeStore.getState().setTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(document.documentElement.classList.contains("light")).toBe(false);
    });

    it("removes previous theme class when switching", () => {
      useThemeStore.getState().setTheme("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);

      useThemeStore.getState().setTheme("light");
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(document.documentElement.classList.contains("light")).toBe(true);
    });
  });
});
