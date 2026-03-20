/**
 * Error tracking and performance monitoring.
 *
 * Initializes Sentry when VITE_SENTRY_DSN is set and @sentry/react is installed.
 * No-op in development or when DSN is absent.
 */

export async function initMonitoring() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  try {
    // Use a variable so Vite's static import analysis can't resolve the specifier.
    const pkg = "@sentry/react";
    const Sentry = await import(/* @vite-ignore */ pkg);
    if (!Sentry?.init) return;

    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      release: (import.meta.env.VITE_GIT_SHA as string) || "unknown",
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
      sendDefaultPii: false,
    });
  } catch {
    // Sentry package not installed — silently skip
  }
}
