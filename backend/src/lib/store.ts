import type { Env, GenerateJob } from "../types";

// Per-isolate memory fallback so the demo works with zero Cloudflare
// resources configured. When AEGIS_JOBS (KV) is bound, jobs persist across
// isolates/requests for real production use.
const memoryStore = new Map<string, GenerateJob>();

export async function saveJob(env: Env, job: GenerateJob): Promise<void> {
  memoryStore.set(job.id, job);
  if (env.AEGIS_JOBS) {
    await env.AEGIS_JOBS.put(job.id, JSON.stringify(job), { expirationTtl: 60 * 60 * 24 });
  }
}

export async function getJob(env: Env, id: string): Promise<GenerateJob | null> {
  if (env.AEGIS_JOBS) {
    const raw = await env.AEGIS_JOBS.get(id);
    if (raw) return JSON.parse(raw) as GenerateJob;
  }
  return memoryStore.get(id) ?? null;
}
