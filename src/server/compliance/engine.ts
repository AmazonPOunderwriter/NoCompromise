// src/server/compliance/engine.ts
// Pure, deterministic ingredient screening. No side effects — easy to test.

import { ALL_RULES, BANNED_INGREDIENTS, CAUTION_INGREDIENTS, type IngredientRule } from "./rules";

export type ComplianceResult = "PASS" | "FAIL" | "NEEDS_REVIEW";

export interface ComplianceFlag {
  rule: IngredientRule;
  matchedTerm: string;
  context: string; // snippet from ingredient text where match was found
}

export interface ComplianceReport {
  result: ComplianceResult;
  banned: ComplianceFlag[];
  caution: ComplianceFlag[];
  cleanTokens: string[];
  summary: string;
  evaluatedAt: string;
}

/**
 * Normalize ingredient input for consistent matching:
 * - lowercase
 * - collapse whitespace
 * - strip parenthetical-only noise (but keep content for aliasing)
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .trim();
}

/**
 * Token-level split for the cleanTokens output: separates ingredient names
 * by common delimiters so we can show "what made it past the screen."
 */
function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[,;()\[\]]|(?: and )/g)
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && t.length < 80);
}

function findMatches(normalized: string, rules: IngredientRule[]): ComplianceFlag[] {
  const flags: ComplianceFlag[] = [];
  for (const rule of rules) {
    for (const alias of rule.aliases) {
      const aliasLower = alias.toLowerCase();
      const idx = normalized.indexOf(aliasLower);
      if (idx === -1) continue;

      // Build context snippet for reviewer UX
      const start = Math.max(0, idx - 20);
      const end = Math.min(normalized.length, idx + aliasLower.length + 20);
      const context = normalized.slice(start, end);

      // Dedupe: only one flag per rule
      if (!flags.some((f) => f.rule.key === rule.key)) {
        flags.push({ rule, matchedTerm: alias, context });
      }
      break;
    }
  }
  return flags;
}

/**
 * Evaluate an ingredient label string against the standard.
 * Decision logic:
 *  - ANY banned match -> FAIL
 *  - No banned + any caution -> NEEDS_REVIEW
 *  - Otherwise -> PASS
 */
export function evaluateCompliance(ingredientText: string): ComplianceReport {
  const normalized = normalize(ingredientText || "");

  const banned = findMatches(normalized, BANNED_INGREDIENTS);
  const caution = findMatches(normalized, CAUTION_INGREDIENTS);

  let result: ComplianceResult;
  let summary: string;

  if (banned.length > 0) {
    result = "FAIL";
    summary = `Rejected. Found ${banned.length} banned ingredient${banned.length > 1 ? "s" : ""}: ${banned
      .map((b) => b.rule.displayName)
      .join(", ")}.`;
  } else if (caution.length > 0) {
    result = "NEEDS_REVIEW";
    summary = `Manual review required. ${caution.length} caution ingredient${caution.length > 1 ? "s" : ""} detected: ${caution
      .map((c) => c.rule.displayName)
      .join(", ")}.`;
  } else {
    result = "PASS";
    summary = "Passes the Zero Compromise standard. No banned or caution ingredients detected.";
  }

  // Tokens the engine didn't flag — useful to show "here's what we saw"
  const allFlagged = new Set(
    [...banned, ...caution].flatMap((f) => f.rule.aliases.map((a) => a.toLowerCase())),
  );
  const cleanTokens = tokenize(ingredientText).filter(
    (t) => !Array.from(allFlagged).some((a) => t.includes(a)),
  );

  return {
    result,
    banned,
    caution,
    cleanTokens,
    summary,
    evaluatedAt: new Date().toISOString(),
  };
}

export { ALL_RULES, BANNED_INGREDIENTS, CAUTION_INGREDIENTS };
