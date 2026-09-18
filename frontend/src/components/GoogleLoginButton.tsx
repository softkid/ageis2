import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { verifyGoogleCredential } from "../lib/api";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export function GoogleLoginButton() {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLIENT_ID || user) return;

    function tryInit() {
      if (!window.google || !buttonRef.current) return false;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
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
    }

    if (!tryInit()) {
      const interval = setInterval(() => {
        if (tryInit()) clearInterval(interval);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [user, setUser]);

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
          className="rounded-full border border-aegis-border px-3 py-1.5 text-sm text-aegis-muted hover:text-aegis-text"
        >
          {t("auth.signOut")}
        </button>
      </div>
    );
  }

  if (!CLIENT_ID) {
    return (
      <span
        title="Set VITE_GOOGLE_CLIENT_ID to enable real Google sign-in"
        className="cursor-not-allowed rounded-full border border-aegis-border px-3 py-1.5 text-sm text-aegis-muted"
      >
        {t("auth.notConfigured")}
      </span>
    );
  }

  return <div ref={buttonRef} />;
}
