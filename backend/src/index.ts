import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./routes/auth";
import { generateRoute } from "./routes/generate";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", cors());

app.get("/api/health", (c) => c.json({ ok: true, app: c.env.APP_NAME ?? "AEGIS AI" }));

app.route("/api/auth", authRoute);
app.route("/api/generate", generateRoute);

// Everything else falls through to the static frontend build served via the
// [assets] binding configured in wrangler.toml.
app.get("*", async (c) => {
  if (c.env.ASSETS) return c.env.ASSETS.fetch(c.req.raw);
  return c.text("AEGIS AI backend is running. Build the frontend and configure [assets] to serve it.");
});

export default app;
