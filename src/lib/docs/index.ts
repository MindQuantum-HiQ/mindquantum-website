import type { Lang } from "../../config/i18n";
import type { DocPage, DocTocEntry, DocTree } from "./types";
import { listArticlePaths } from "./scan";
import { extractPage, extractSidebar } from "./extract";

export * from "./types";
export { resolveDocLink, slugFromSourcePath } from "./paths";

// Cache trees per (lang + base) so repeated getStaticPaths calls in dev are cheap.
const cache = new Map<string, DocTree>();

function flattenOrder(items: DocTocEntry[]): string[] {
  const out: string[] = [];
  const walk = (list: DocTocEntry[]) => {
    for (const item of list) {
      out.push(item.href);
      if (item.children?.length) walk(item.children);
    }
  };
  walk(items);
  return out;
}

/**
 * Build the full docs tree for a language: primary sidebar + every extracted
 * article body + a flat slug-ordered list used for the prev/next footer when
 * the article's own <link rel> pair is missing.
 */
export function buildDocTree(lang: Lang, baseUrl: string): DocTree {
  const key = `${lang}@${baseUrl}`;
  const existing = cache.get(key);
  if (existing) return existing;

  const articlePaths = listArticlePaths(lang);
  const pages: DocPage[] = [];
  const flat: Record<string, DocPage> = {};

  for (const sourcePath of articlePaths) {
    const page = extractPage(lang, sourcePath, baseUrl);
    if (page) {
      pages.push(page);
      flat[page.slug] = page;
    }
  }

  const sections = extractSidebar(lang, "src/index.html", baseUrl);

  const order: string[] = [];
  for (const section of sections) {
    for (const href of flattenOrder(section.items)) order.push(href);
  }

  const tree: DocTree = { lang, sections, pages, flat, order };
  cache.set(key, tree);
  return tree;
}
