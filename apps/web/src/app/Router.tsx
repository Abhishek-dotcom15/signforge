import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Skeleton } from "@/components/common/Skeleton";

// Lazy load pages for code splitting
const LandingPage = lazy(() => import("@/features/landing/LandingPage").then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("@/features/auth/components/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("@/features/auth/components/RegisterPage").then((m) => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import("@/features/auth/components/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const TranslatePage = lazy(() => import("@/features/communication/components/TranslatePage").then((m) => ({ default: m.TranslatePage })));
const DictionaryPage = lazy(() => import("@/features/dictionary/DictionaryPage").then((m) => ({ default: m.DictionaryPage })));
const StoriesPage = lazy(() => import("@/features/stories/StoriesPage").then((m) => ({ default: m.StoriesPage })));
const LearnPage = lazy(() => import("@/features/learn/LearnPage").then((m) => ({ default: m.LearnPage })));
const DeveloperPage = lazy(() => import("@/features/developer/DeveloperPage").then((m) => ({ default: m.DeveloperPage })));
const ClassroomPage = lazy(() => import("@/features/education/ClassroomPage").then((m) => ({ default: m.ClassroomPage })));
const AuditorPage = lazy(() => import("@/features/audit/AuditorPage").then((m) => ({ default: m.AuditorPage })));
const AdminPage = lazy(() => import("@/features/admin/AdminPage").then((m) => ({ default: m.AdminPage })));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage").then((m) => ({ default: m.SettingsPage })));

function PageLoader() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

function SuspensePage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

const router = createBrowserRouter([
  // Public landing
  {
    path: "/",
    element: <SuspensePage><LandingPage /></SuspensePage>,
  },

  // Public auth pages
  {
    path: "/login",
    element: <SuspensePage><LoginPage /></SuspensePage>,
  },
  {
    path: "/register",
    element: <SuspensePage><RegisterPage /></SuspensePage>,
  },

  // App shell with sidebar (protected)
  {
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { path: "/dashboard", element: <SuspensePage><DashboardPage /></SuspensePage> },
      { path: "/translate", element: <SuspensePage><TranslatePage /></SuspensePage> },
      { path: "/dictionary", element: <SuspensePage><DictionaryPage /></SuspensePage> },
      { path: "/stories", element: <SuspensePage><StoriesPage /></SuspensePage> },
      { path: "/learn", element: <SuspensePage><LearnPage /></SuspensePage> },
      { path: "/developer", element: <SuspensePage><DeveloperPage /></SuspensePage> },
      { path: "/classroom", element: <SuspensePage><ClassroomPage /></SuspensePage> },
      { path: "/auditor", element: <SuspensePage><AuditorPage /></SuspensePage> },
      { path: "/admin", element: <SuspensePage><AdminPage /></SuspensePage> },
      { path: "/settings", element: <SuspensePage><SettingsPage /></SuspensePage> },
    ],
  },

  // 404
  {
    path: "*",
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-[var(--text-muted)]">404</h1>
          <p className="mt-2 text-[var(--text-secondary)]">Page not found</p>
        </div>
      </div>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
