import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Prefer the current working directory — Astro/Vite set it to the project
// root during `astro build` and `astro dev`. Fall back to a relative walk
// from this file if the cwd doesn't look like the project root (defensive).
function computeRepoRoot(): string {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, "astro.config.mjs"))) return cwd;
  const thisFile = fileURLToPath(import.meta.url);
  const fromUrl = path.resolve(path.dirname(thisFile), "..", "..", "..");
  if (fs.existsSync(path.join(fromUrl, "astro.config.mjs"))) return fromUrl;
  return cwd;
}

export const REPO_ROOT = computeRepoRoot();
export const PUBLIC_DIR = path.join(REPO_ROOT, "public");
export const DOCS_PUBLIC_DIR = path.join(PUBLIC_DIR, "docs");

/**
 * Convert a source HTML path (relative to the language root) to a clean slug.
 * Drops `.html` and normalises the root index to the empty string so the
 * catch-all route `/docs/{lang}/` serves it.
 */
export function slugFromSourcePath(sourcePath: string): string {
  const stripped = sourcePath.replace(/\.html$/, "").replace(/\\/g, "/");
  if (stripped === "src/index" || stripped === "index") return "";
  return stripped;
}

/**
 * Resolve a relative href emitted by Sphinx against the current source path
 * and return either a clean Astro route slug (for html), an absolute public
 * asset path (for static files), or null when the target isn't a local file.
 */
export interface ResolvedLink {
  kind: "slug" | "asset" | "fragment" | "external" | "search" | "genindex";
  /** Slug for kind=slug (may be empty for root). */
  slug?: string;
  /** Fragment suffix including `#`, if any. */
  hash?: string;
  /** Original href (for external/other kinds). */
  href?: string;
  /** Asset path relative to docs/{lang}/ (for kind=asset). */
  assetPath?: string;
}

export function resolveDocLink(
  href: string,
  currentSourcePath: string,
): ResolvedLink {
  if (!href) return { kind: "fragment", href };

  // Fragments / anchors
  if (href.startsWith("#")) return { kind: "fragment", href };

  // Protocol-relative or absolute URLs we do not own
  if (/^([a-z]+:)?\/\//i.test(href) || /^(mailto:|tel:)/i.test(href)) {
    return { kind: "external", href };
  }

  // Site-absolute URL → treat as external (may leave the docs)
  if (href.startsWith("/")) return { kind: "external", href };

  const [rawPath, ...hashParts] = href.split("#");
  const hash = hashParts.length ? `#${hashParts.join("#")}` : "";
  const currentDir = path.posix.dirname(currentSourcePath.replace(/\\/g, "/"));
  const resolvedRel = path.posix.normalize(
    path.posix.join(currentDir === "." ? "" : currentDir, rawPath),
  );

  // Search / genindex are emitted relative to the language root.
  if (resolvedRel === "search.html") return { kind: "search", hash };
  if (resolvedRel === "genindex.html") return { kind: "genindex", hash };

  // Static assets live under _images, _static, _sources, _sphinx_design_static.
  if (/^(_images|_static|_sources|_sphinx_design_static)\//.test(resolvedRel)) {
    return { kind: "asset", assetPath: resolvedRel, hash };
  }

  // Anything ending in .html is another doc page.
  if (resolvedRel.endsWith(".html")) {
    return { kind: "slug", slug: slugFromSourcePath(resolvedRel), hash };
  }

  // Fallback — treat as asset (covers .py / .ipynb raw downloads).
  return { kind: "asset", assetPath: resolvedRel, hash };
}
