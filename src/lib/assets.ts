import manifest from "@/generated/asset-manifest.json";

const files = manifest as Record<string, string>;

/**
 * Resolves an official brand export from public/zaghalil.
 * `asset("characters/zaghloul")` → "/zaghalil/characters/zaghloul.webp" | undefined
 * Callers render a designed stand-in when the export has not been dropped in yet.
 */
export function asset(key: string): string | undefined {
  return files[key];
}

export function firstAsset(...keys: string[]): string | undefined {
  for (const k of keys) {
    const hit = files[k];
    if (hit) return hit;
  }
  return undefined;
}
