export type Engine = "unity" | "unreal" | "web";
export type GameGenre = "rpg" | "action" | "adventure" | "simulation" | "strategy";

export interface GenerateRequest {
  idea: string;
  genre?: GameGenre;
  platform?: Engine;
  locale?: string;
}

export interface AgentStageResult {
  key: "story" | "characters" | "quests" | "assets" | "code";
  title: string;
  summary: string;
  files: GeneratedFile[];
  durationMs: number;
}

export interface GeneratedFile {
  path: string;
  kind: "text" | "json" | "code";
  content: string;
  sizeBytes: number;
}

export interface GovernanceCheck {
  key: "content_policy" | "code_convention" | "data_consistency" | "dependency_check";
  title: string;
  detail: string;
  status: "pass" | "warn" | "fail";
}

export interface GenerateJob {
  id: string;
  createdAt: number;
  request: GenerateRequest;
  title: string;
  tagline: string;
  stages: AgentStageResult[];
  governance: GovernanceCheck[];
  governancePassed: boolean;
}

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Env {
  APP_NAME: string;
  GOOGLE_CLIENT_ID?: string;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ASSETS?: Fetcher;
  // Optional persistence bindings (see wrangler.toml)
  AEGIS_JOBS?: KVNamespace;
  AEGIS_DB?: D1Database;
  AEGIS_PACKAGES?: R2Bucket;
}
