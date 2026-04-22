import type { Lang } from "../../config/i18n";

export interface DocTocEntry {
  href: string;
  label: string;
  current?: boolean;
  children?: DocTocEntry[];
}

export interface DocSidebarSection {
  caption?: string;
  items: DocTocEntry[];
}

export interface DocPageTocItem {
  href: string;
  label: string;
  level: number;
  children?: DocPageTocItem[];
}

export interface DocPrevNext {
  href: string;
  title: string;
}

export interface DocPage {
  lang: Lang;
  slug: string; // e.g. "src/beginner/beginner" or "" for root
  sourcePath: string; // e.g. "src/beginner/beginner.html" relative to docs/{lang}
  title: string;
  bodyHtml: string;
  pageToc: DocPageTocItem[];
  prev: DocPrevNext | null;
  next: DocPrevNext | null;
  thebeConfig: string | null; // raw JSON config for sphinx-thebe
  kernelPath: string | null; // optional path override for Thebe kernels
}

export interface DocTree {
  lang: Lang;
  sections: DocSidebarSection[]; // parsed primary sidebar (with caption groups)
  pages: DocPage[];
  order: string[]; // slugs in sidebar-flat order (for prev/next fallback)
  flat: Record<string, DocPage>; // slug → page
}
