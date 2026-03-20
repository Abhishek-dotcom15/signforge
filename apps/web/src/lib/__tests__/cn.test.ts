import { describe, it, expect } from "vitest";
import { cn } from "../cn";

describe("cn", () => {
  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("returns a single class name", () => {
    expect(cn("px-4")).toBe("px-4");
  });

  it("merges multiple class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes with clsx syntax", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("handles undefined and null values", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("merges conflicting Tailwind classes (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("merges conflicting color classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles object syntax from clsx", () => {
    expect(cn({ "bg-red-500": true, "bg-blue-500": false })).toBe("bg-red-500");
  });

  it("handles array syntax from clsx", () => {
    expect(cn(["px-2", "py-2"])).toBe("px-2 py-2");
  });

  it("handles complex merge with conditionals", () => {
    const isActive = true;
    const result = cn(
      "rounded-md px-4 py-2",
      isActive && "bg-blue-500 text-white",
      !isActive && "bg-gray-200",
    );
    expect(result).toBe("rounded-md px-4 py-2 bg-blue-500 text-white");
  });
});
