import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { PageSpinner } from "@/components/common/Spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  if (isLoading) return <PageSpinner />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
