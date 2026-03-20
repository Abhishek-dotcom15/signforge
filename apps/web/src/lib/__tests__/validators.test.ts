import { describe, it, expect } from "vitest";
import { validators } from "../validators";

describe("validators", () => {
  describe("required", () => {
    const validate = validators.required();

    it("returns error for undefined", () => {
      expect(validate(undefined)).toBe("This field is required");
    });

    it("returns error for null", () => {
      expect(validate(null)).toBe("This field is required");
    });

    it("returns error for empty string", () => {
      expect(validate("")).toBe("This field is required");
    });

    it("passes for non-empty string", () => {
      expect(validate("hello")).toBeUndefined();
    });

    it("passes for number zero", () => {
      expect(validate(0)).toBeUndefined();
    });

    it("passes for boolean false", () => {
      expect(validate(false)).toBeUndefined();
    });

    it("uses custom message", () => {
      const custom = validators.required("Name is required");
      expect(custom("")).toBe("Name is required");
    });
  });

  describe("email", () => {
    const validate = validators.email();

    it("passes for empty value (not required)", () => {
      expect(validate("")).toBeUndefined();
    });

    it("passes for valid email", () => {
      expect(validate("user@example.com")).toBeUndefined();
    });

    it("passes for email with subdomain", () => {
      expect(validate("user@mail.example.com")).toBeUndefined();
    });

    it("fails for missing @", () => {
      expect(validate("userexample.com")).toBe("Please enter a valid email");
    });

    it("fails for missing domain", () => {
      expect(validate("user@")).toBe("Please enter a valid email");
    });

    it("fails for missing TLD", () => {
      expect(validate("user@example")).toBe("Please enter a valid email");
    });

    it("fails for spaces in email", () => {
      expect(validate("user @example.com")).toBe("Please enter a valid email");
    });

    it("uses custom message", () => {
      const custom = validators.email("Invalid email format");
      expect(custom("bad")).toBe("Invalid email format");
    });
  });

  describe("minLength", () => {
    const validate = validators.minLength(3);

    it("passes for empty value (not required)", () => {
      expect(validate("")).toBeUndefined();
    });

    it("passes for value at minimum length", () => {
      expect(validate("abc")).toBeUndefined();
    });

    it("passes for value above minimum length", () => {
      expect(validate("abcd")).toBeUndefined();
    });

    it("fails for value below minimum length", () => {
      expect(validate("ab")).toBe("Must be at least 3 characters");
    });

    it("uses custom message", () => {
      const custom = validators.minLength(5, "Too short");
      expect(custom("abc")).toBe("Too short");
    });
  });

  describe("maxLength", () => {
    const validate = validators.maxLength(5);

    it("passes for empty value (not required)", () => {
      expect(validate("")).toBeUndefined();
    });

    it("passes for value at maximum length", () => {
      expect(validate("abcde")).toBeUndefined();
    });

    it("passes for value below maximum length", () => {
      expect(validate("abc")).toBeUndefined();
    });

    it("fails for value above maximum length", () => {
      expect(validate("abcdef")).toBe("Must be at most 5 characters");
    });

    it("uses custom message", () => {
      const custom = validators.maxLength(3, "Too long");
      expect(custom("abcde")).toBe("Too long");
    });
  });

  describe("match", () => {
    it("passes when values match", () => {
      const validate = validators.match("password", () => "secret123");
      expect(validate("secret123")).toBeUndefined();
    });

    it("fails when values do not match", () => {
      const validate = validators.match("password", () => "secret123");
      expect(validate("different")).toBe("Must match password");
    });

    it("uses custom message", () => {
      const validate = validators.match("password", () => "a", "Passwords must match");
      expect(validate("b")).toBe("Passwords must match");
    });
  });

  describe("url", () => {
    const validate = validators.url();

    it("passes for empty value (not required)", () => {
      expect(validate("")).toBeUndefined();
    });

    it("passes for valid HTTP URL", () => {
      expect(validate("https://example.com")).toBeUndefined();
    });

    it("passes for URL with path", () => {
      expect(validate("https://example.com/path/to/resource")).toBeUndefined();
    });

    it("fails for plain text", () => {
      expect(validate("not-a-url")).toBe("Please enter a valid URL");
    });

    it("fails for missing protocol", () => {
      expect(validate("example.com")).toBe("Please enter a valid URL");
    });

    it("uses custom message", () => {
      const custom = validators.url("Bad URL");
      expect(custom("nope")).toBe("Bad URL");
    });
  });

  describe("compose", () => {
    it("returns undefined when all validators pass", () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(3),
        validators.maxLength(10),
      );
      expect(validate("hello")).toBeUndefined();
    });

    it("returns first error encountered", () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(3),
      );
      expect(validate("")).toBe("This field is required");
    });

    it("returns second validator error if first passes", () => {
      const validate = validators.compose(
        validators.required(),
        validators.email(),
      );
      expect(validate("not-an-email")).toBe("Please enter a valid email");
    });

    it("stops at first error and does not run subsequent validators", () => {
      const validate = validators.compose(
        validators.required(),
        validators.minLength(5),
        validators.maxLength(3),
      );
      // Empty string triggers required error first
      expect(validate("")).toBe("This field is required");
    });
  });
});
