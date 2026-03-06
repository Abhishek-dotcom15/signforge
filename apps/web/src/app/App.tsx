import { Providers } from "./Providers";
import { Router } from "./Router";
import { useAuthInit } from "@/features/auth/hooks/useAuthInit";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}

export default function App() {
  return (
    <Providers>
      <AuthInitializer>
        <Router />
      </AuthInitializer>
    </Providers>
  );
}
