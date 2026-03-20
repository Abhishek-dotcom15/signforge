import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useForm } from "../useForm";

describe("useForm", () => {
  const defaultOptions = {
    initialValues: { name: "", email: "" },
    onSubmit: vi.fn(),
  };

  describe("initialization", () => {
    it("initializes with provided values", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "John", email: "john@test.com" },
          onSubmit: vi.fn(),
        }),
      );

      expect(result.current.values).toEqual({ name: "John", email: "john@test.com" });
    });

    it("starts with no errors", () => {
      const { result } = renderHook(() => useForm(defaultOptions));
      expect(result.current.errors).toEqual({});
    });

    it("starts with no touched fields", () => {
      const { result } = renderHook(() => useForm(defaultOptions));
      expect(result.current.touched).toEqual({});
    });

    it("starts with isSubmitting false", () => {
      const { result } = renderHook(() => useForm(defaultOptions));
      expect(result.current.isSubmitting).toBe(false);
    });

    it("starts as valid (no errors)", () => {
      const { result } = renderHook(() => useForm(defaultOptions));
      expect(result.current.isValid).toBe(true);
    });
  });

  describe("setValue", () => {
    it("updates a field value", () => {
      const { result } = renderHook(() => useForm(defaultOptions));

      act(() => {
        result.current.setValue("name", "Jane");
      });

      expect(result.current.values.name).toBe("Jane");
    });

    it("marks the field as touched", () => {
      const { result } = renderHook(() => useForm(defaultOptions));

      act(() => {
        result.current.setValue("name", "Jane");
      });

      expect(result.current.touched.name).toBe(true);
    });

    it("runs field validator on change", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "");
      });

      expect(result.current.errors.name).toBe("Required");
    });

    it("clears error when valid value is set", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "");
      });
      expect(result.current.errors.name).toBe("Required");

      act(() => {
        result.current.setValue("name", "John");
      });
      expect(result.current.errors.name).toBeUndefined();
    });
  });

  describe("getFieldProps", () => {
    it("returns value for a field", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "Alice" },
          onSubmit: vi.fn(),
        }),
      );

      const props = result.current.getFieldProps("name");
      expect(props.value).toBe("Alice");
    });

    it("does not return error for untouched field", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      const props = result.current.getFieldProps("name");
      expect(props.error).toBeUndefined();
    });

    it("returns error for touched field with invalid value", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "");
      });

      const props = result.current.getFieldProps("name");
      expect(props.error).toBe("Required");
    });

    it("returns an onChange handler", () => {
      const { result } = renderHook(() => useForm(defaultOptions));
      const props = result.current.getFieldProps("name");
      expect(typeof props.onChange).toBe("function");
    });
  });

  describe("handleSubmit", () => {
    it("calls onSubmit when form is valid", async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "John" },
          onSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({ name: "John" });
    });

    it("does not call onSubmit when validation fails", async () => {
      const onSubmit = vi.fn();
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit,
        }),
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("sets all fields as touched on submit", async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "", email: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.touched.name).toBe(true);
      expect(result.current.touched.email).toBe(true);
    });

    it("shows validation errors after failed submit", async () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Name is required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.errors.name).toBe("Name is required");
    });

    it("prevents default form event", async () => {
      const preventDefault = vi.fn();
      const { result } = renderHook(() => useForm(defaultOptions));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault } as unknown as React.FormEvent);
      });

      expect(preventDefault).toHaveBeenCalled();
    });

    it("sets isSubmitting during async submit", async () => {
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });

      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "John" },
          onSubmit: () => submitPromise,
        }),
      );

      let submitDone: Promise<void>;
      act(() => {
        submitDone = result.current.handleSubmit();
      });

      // isSubmitting should be true while the promise is pending
      expect(result.current.isSubmitting).toBe(true);

      await act(async () => {
        resolveSubmit!();
        await submitDone!;
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("reset", () => {
    it("resets values to initial values", () => {
      const { result } = renderHook(() => useForm(defaultOptions));

      act(() => {
        result.current.setValue("name", "Changed");
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual({ name: "", email: "" });
    });

    it("clears errors", () => {
      const { result } = renderHook(() =>
        useForm({
          initialValues: { name: "" },
          validators: {
            name: (value) => (!value ? "Required" : undefined),
          },
          onSubmit: vi.fn(),
        }),
      );

      act(() => {
        result.current.setValue("name", "");
      });
      expect(result.current.errors.name).toBe("Required");

      act(() => {
        result.current.reset();
      });
      expect(result.current.errors).toEqual({});
    });

    it("clears touched state", () => {
      const { result } = renderHook(() => useForm(defaultOptions));

      act(() => {
        result.current.setValue("name", "Test");
      });
      expect(result.current.touched.name).toBe(true);

      act(() => {
        result.current.reset();
      });
      expect(result.current.touched).toEqual({});
    });

    it("resets isSubmitting to false", () => {
      const { result } = renderHook(() => useForm(defaultOptions));

      act(() => {
        result.current.reset();
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
