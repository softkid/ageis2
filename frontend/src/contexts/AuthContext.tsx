import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthUser } from "../lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("aegis_user");
      return saved ? (JSON.parse(saved) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    try {
      if (u) localStorage.setItem("aegis_user", JSON.stringify(u));
      else localStorage.removeItem("aegis_user");
    } catch {}
  };

  const value = useMemo(() => ({ user, setUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
