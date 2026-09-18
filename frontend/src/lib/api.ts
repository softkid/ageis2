import type { AuthUser, Engine, GenerateJob, GenerateRequest } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function startGeneration(req: GenerateRequest): Promise<{ jobId: string }> {
  return request("/api/generate", { method: "POST", body: JSON.stringify(req) });
}

export async function fetchJob(jobId: string): Promise<GenerateJob> {
  return request(`/api/generate/${jobId}`);
}

export function packageDownloadUrl(jobId: string, engine: Engine): string {
  return `${API_BASE}/api/generate/${jobId}/package?engine=${engine}`;
}

export async function verifyGoogleCredential(credential: string): Promise<{ user: AuthUser }> {
  return request("/api/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
}
