import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useRegister } from "../hooks/useLogin";

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDeaf, setIsDeaf] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const register = useRegister();

  const validate = () => {
    const e: typeof errors = {};
    if (!fullName.trim()) e.fullName = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      register.mutate({ email, password, fullName, isDeaf });
    }
  };

  const clearError = (field: keyof typeof errors) => {
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-canvas)] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            SF
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create your account</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Start using ISL translation in 60 seconds</p>
        </div>

        <div className="rounded-xl border bg-[var(--bg-primary)] p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = "/api/auth/oauth/google"}>
              Continue with Google
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => window.location.href = "/api/auth/oauth/github"}>
              Continue with GitHub
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--border-default)]" />
            <span className="text-xs text-[var(--text-muted)]">or</span>
            <div className="h-px flex-1 bg-[var(--border-default)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); clearError("fullName"); }}
              error={errors.fullName}
              placeholder="Your full name"
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              error={errors.password}
              placeholder="Min 8 characters"
              autoComplete="new-password"
            />

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isDeaf}
                onChange={(e) => setIsDeaf(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className="text-sm text-[var(--text-secondary)]">
                I am deaf or hard of hearing
              </span>
            </label>

            <Button type="submit" className="w-full" loading={register.isPending}>
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
