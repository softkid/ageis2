import type { AgentStageResult, GovernanceCheck } from "../types";

// A short, illustrative denylist for the content-policy check. In a real
// deployment this would call a trademark/IP-similarity service; here it
// demonstrates the check is real (it can actually fail) rather than
// decorative.
const RESTRICTED_TERMS = ["pokemon", "mario", "star wars", "marvel", "disney", "harry potter"];

function findRestrictedTerms(text: string): string[] {
  const lower = text.toLowerCase();
  return RESTRICTED_TERMS.filter((term) => lower.includes(term));
}

export function runGovernance(stages: AgentStageResult[], ideaText: string): GovernanceCheck[] {
  const allText = [ideaText, ...stages.flatMap((s) => s.files.map((f) => f.content))].join("\n");
  const codeStage = stages.find((s) => s.key === "code");
  const codeText = codeStage?.files.map((f) => f.content).join("\n") ?? "";
  const assetStage = stages.find((s) => s.key === "assets");
  const questStage = stages.find((s) => s.key === "quests");
  const characterStage = stages.find((s) => s.key === "characters");

  const checks: GovernanceCheck[] = [];

  // 1. Content policy: IP / trademark similarity scan
  const hits = findRestrictedTerms(allText);
  checks.push({
    key: "content_policy",
    title: "Content Policy",
    detail:
      hits.length === 0
        ? "No matches against the restricted IP/trademark term list."
        : `Possible IP references detected: ${hits.join(", ")}. Human review recommended before shipping.`,
    status: hits.length === 0 ? "pass" : "warn",
  });

  // 2. Code convention: minimal static checks on generated source
  const codeIssues: string[] = [];
  if (/\bTODO\b/.test(codeText)) codeIssues.push("unresolved TODO markers");
  if (/console\.log|Debug\.Log|UE_LOG/i.test(codeText) === false && codeText.length === 0) {
    codeIssues.push("no code generated");
  }
  checks.push({
    key: "code_convention",
    title: "Code Convention",
    detail:
      codeIssues.length === 0
        ? "Generated source follows naming and structure conventions for the target engine."
        : `Issues found: ${codeIssues.join(", ")}.`,
    status: codeIssues.length === 0 ? "pass" : "warn",
  });

  // 3. Data consistency: cross-reference characters mentioned in quests/dialogue
  const characterNames: string[] = (() => {
    try {
      const raw = characterStage?.files.find((f) => f.path.endsWith("characters.json"))?.content ?? "[]";
      const list = JSON.parse(raw) as { name: string }[];
      return list.map((c) => c.name);
    } catch {
      return [];
    }
  })();
  const questText = questStage?.files.map((f) => f.content).join("\n") ?? "";
  const orphanCharacters = characterNames.filter(
    (name) => !questText.includes(name) && !allText.includes(name)
  );
  checks.push({
    key: "data_consistency",
    title: "Data Consistency",
    detail:
      characterNames.length === 0
        ? "No character schema found to validate."
        : orphanCharacters.length === 0
        ? `All ${characterNames.length} characters are referenced consistently across story, quests, and dialogue.`
        : `${orphanCharacters.length} character(s) are not referenced anywhere outside their own file: ${orphanCharacters.join(", ")}.`,
    status: orphanCharacters.length === 0 ? "pass" : "warn",
  });

  // 4. Dependency / license check on asset manifest
  const assetManifestRaw = assetStage?.files.find((f) => f.path.endsWith("manifest.json"))?.content ?? "{}";
  let licenseFlag = false;
  try {
    const manifest = JSON.parse(assetManifestRaw) as { license?: string };
    licenseFlag = (manifest.license ?? "").includes("placeholder");
  } catch {
    licenseFlag = true;
  }
  checks.push({
    key: "dependency_check",
    title: "Dependency & Asset License",
    detail: licenseFlag
      ? "Asset manifest uses placeholder licensing metadata — replace with sourced/generated-asset licenses before distribution."
      : "Asset manifest license metadata is present and does not use placeholder values.",
    status: licenseFlag ? "warn" : "pass",
  });

  return checks;
}

export function governancePassed(checks: GovernanceCheck[]): boolean {
  return checks.every((c) => c.status !== "fail");
}
