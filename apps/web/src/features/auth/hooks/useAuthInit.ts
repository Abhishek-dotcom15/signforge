import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { authApi } from "../api/auth-api";

export function useAuthInit() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((user) => setUser(user))
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setLoading(false);
      });
  }, [setUser, setLoading]);
}
