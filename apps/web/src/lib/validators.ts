export const validators = {
  required: (msg = "This field is required") => (value: unknown) => {
    if (value === undefined || value === null || value === "") return msg;
    return undefined;
  },

  email: (msg = "Please enter a valid email") => (value: unknown) => {
    if (!value) return undefined;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(value))) return msg;
    return undefined;
  },

  minLength: (min: number, msg?: string) => (value: unknown) => {
    if (!value) return undefined;
    if (String(value).length < min) return msg || `Must be at least ${min} characters`;
    return undefined;
  },

  maxLength: (max: number, msg?: string) => (value: unknown) => {
    if (!value) return undefined;
    if (String(value).length > max) return msg || `Must be at most ${max} characters`;
    return undefined;
  },

  match: (fieldName: string, getValue: () => unknown, msg?: string) => (value: unknown) => {
    if (value !== getValue()) return msg || `Must match ${fieldName}`;
    return undefined;
  },

  url: (msg = "Please enter a valid URL") => (value: unknown) => {
    if (!value) return undefined;
    try {
      new URL(String(value));
      return undefined;
    } catch {
      return msg;
    }
  },

  compose: (...fns: ((value: unknown) => string | undefined)[]) => (value: unknown) => {
    for (const fn of fns) {
      const error = fn(value);
      if (error) return error;
    }
    return undefined;
  },
};
