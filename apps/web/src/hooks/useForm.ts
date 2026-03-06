import { useState, useCallback, type ChangeEvent } from "react";

type Validator<T> = {
  [K in keyof T]?: (value: T[K], values: T) => string | undefined;
};

interface UseFormOptions<T> {
  initialValues: T;
  validators?: Validator<T>;
  onSubmit: (values: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  validators,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      const validator = validators?.[name];
      if (validator) {
        return validator(value, { ...values, [name]: value });
      }
      return undefined;
    },
    [validators, values],
  );

  const validateAll = useCallback(() => {
    if (!validators) return {};
    const newErrors: Partial<Record<keyof T, string>> = {};
    let hasError = false;
    for (const key of Object.keys(validators) as (keyof T)[]) {
      const error = validators[key]?.(values[key], values);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    }
    return hasError ? newErrors : {};
  }, [validators, values]);

  const setValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
  }, [validateField]);

  const handleChange = useCallback(
    (name: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(name, e.target.value as T[keyof T]);
    },
    [setValue],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      const allErrors = validateAll();
      setErrors(allErrors);
      const allTouched = Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>,
      );
      setTouched(allTouched);

      if (Object.keys(allErrors).length > 0) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit, initialValues],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (name: keyof T) => ({
      value: values[name] as string,
      onChange: handleChange(name),
      error: touched[name] ? errors[name] : undefined,
    }),
    [values, errors, touched, handleChange],
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    handleChange,
    handleSubmit,
    reset,
    getFieldProps,
    isValid: Object.keys(errors).length === 0,
  };
}
