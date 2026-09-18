import { Hono } from "hono";
import type { AuthUser, Env } from "../types";

export const authRoute = new Hono<{ Bindings: Env }>();

/**
 * The frontend uses Google Identity Services' "Sign in with Google" button,
 * which returns a signed JWT credential directly in the browser. We verify
 * that JWT server-side with Google's tokeninfo endpoint before trusting it —
 * no client secret needed for this flow.
 */
authRoute.post("/google", async (c) => {
  const body = await c.req
    .json<{ credential?: string }>()
    .catch(() => ({ credential: undefined }) as { credential?: string });
  const credential = body.credential;
  if (!credential) {
    return c.json({ error: "Missing credential" }, 400);
  }

  try {
    const res = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!res.ok) {
      return c.json({ error: "Invalid Google credential" }, 401);
    }
    const payload = (await res.json()) as {
      sub: string;
      email: string;
      name?: string;
      picture?: string;
      aud?: string;
    };

    const expectedClientId = c.env.GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
      return c.json({ error: "Credential was not issued for this app" }, 401);
    }

    const user: AuthUser = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email,
      picture: payload.picture,
    };

    // A real deployment would mint a session cookie / signed JWT here and
    // persist the user row in D1. For this scaffold we just echo the
    // verified identity back — the frontend stores it in memory.
    return c.json({ user });
  } catch {
    return c.json({ error: "Could not verify credential with Google" }, 502);
  }
});
