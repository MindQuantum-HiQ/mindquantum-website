import fs from "node:fs";
import path from "node:path";
import type { Lang } from "../../config/i18n";
import { DOCS_PUBLIC_DIR } from "./paths";

const EXCLUDE_DIRS = new Set([
  "_images",
  "_static",
  "_sources",
  "_sphinx_design_static",
]);
const EXCLUDE_FILES = new Set(["search.html", "genindex.html"]);

/**
 * Walk the pre-built Jupyter Book output and return every article HTML file
 * (relative to the language root), excluding asset dirs and Sphinx-owned
 * utility pages like `search.html` / `genindex.html`.
 */
export function listArticlePaths(lang: Lang): string[] {
  const root = path.join(DOCS_PUBLIC_DIR, lang);
  if (!fs.existsSync(root)) return [];

  const results: string[] = [];
  const walk = (dir: string, prefix: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        if (entry.name.startsWith(".")) continue;
        walk(path.join(dir, entry.name), path.posix.join(prefix, entry.name));
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        if (EXCLUDE_FILES.has(entry.name)) continue;
        results.push(path.posix.join(prefix, entry.name));
      }
    }
  };
  walk(root, "");
  return results;
}
