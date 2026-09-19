import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { verifyGoogleCredential } from "../lib/api";

const getClientId = () =>
  import.meta.env.VITE_GOOGLE_CLIENT_ID || (typeof window !== "undefined" ? (window as unknown as { VITE_GOOGLE_CLIENT_ID?: string }).VITE_GOOGLE_CLIENT_ID : undefined);

export function GoogleLoginButton() {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  const clientId = getClientId();

  useEffect(() => {
    if (!clientId || user) return;

    function tryInit() {
      if (!window.google || !buttonRef.current) return false;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            try {
              const { user: verified } = await verifyGoogleCredential(response.credential);
              setUser(verified);
            } catch (err) {
              console.error("Google sign-in verification failed", err);
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "filled_black",
          size: "medium",
          shape: "pill",
          text: "signin",
        });
        return true;
      } catch (e) {
        console.error("GSI initialize failed:", e);
        return false;
      }
    }

    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [clientId, user, setUser]);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.picture && (
          <img src={user.picture} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" />
        )}
        <span className="hidden text-sm text-aegis-muted sm:inline">
          {t("auth.signedInAs", { name: user.name })}
        </span>
        <button
          onClick={() => setUser(null)}
          className="rounded-full border border-aegis-border px-3 py-1.5 text-sm text-aegis-muted hover:text-aegis-text transition-colors"
        >
          {t("auth.signOut")}
        </button>
      </div>
    );
  }

  if (!clientId) {
    return (
      <button
        onClick={() => {
          if (window.google?.accounts?.id) {
            const id = prompt("Google Client ID를 입력하세요:");
            if (!id) return;
            window.google.accounts.id.initialize({
              client_id: id,
              callback: async (response: { credential: string }) => {
                try {
                  const { user: verified } = await verifyGoogleCredential(response.credential);
                  setUser(verified);
                } catch (err) {
                  console.error("Google sign-in verification failed", err);
                }
              },
            });
            window.google.accounts.id.prompt();
          } else {
            alert("Google Sign-In API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
          }
        }}
        className="rounded-full border border-aegis-border px-3.5 py-1.5 text-sm font-medium text-aegis-text hover:bg-aegis-surface transition-colors flex items-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 2-1.6 5-4.5 7l6.9 5.3c4.1-3.8 6.6-9.4 6.6-15.6" />
          <path fill="#34A853" d="M24 46c6 0 11-2 14.5-5.4l-6.9-5.3c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C7.9 41 15.4 46 24 46" />
          <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7.1-5.5A22 22 0 0 0 2 24c0 3.5.9 6.9 2.4 9.9z" />
          <path fill="#EA4335" d="M24 10.6c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 4.4 30 2 24 2 15.4 2 7.9 7 4.4 14.1l7.1 5.5c1.8-5.3 6.7-9 12.5-9" />
        </svg>
        {t("app.signIn", "Google 로그인")}
      </button>
    );
  }

  return <div ref={buttonRef} />;
}
