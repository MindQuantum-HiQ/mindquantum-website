import fs from "node:fs";
import path from "node:path";
import { parse, type HTMLElement } from "node-html-parser";
import type { Lang } from "../../config/i18n";
import type {
  DocPage,
  DocPageTocItem,
  DocPrevNext,
  DocSidebarSection,
  DocTocEntry,
} from "./types";
import { DOCS_PUBLIC_DIR, slugFromSourcePath, resolveDocLink } from "./paths";

const DECORATIVE_CLASSES = [
  "headerlink",
  "copybtn",
];

/** Remove small Sphinx decorations that don't belong in a redesigned shell. */
function stripDecorations(root: HTMLElement) {
  for (const cls of DECORATIVE_CLASSES) {
    root.querySelectorAll(`.${cls}`).forEach((el) => el.remove());
  }
}

/** Rewrite href/src attributes to point at the new Astro routes or public assets. */
function rewriteUrls(
  root: HTMLElement,
  sourcePath: string,
  lang: Lang,
  baseUrl: string,
) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const langRoot = `${base}docs/${lang}/`;

  const rewriteAttr = (el: HTMLElement, attr: string) => {
    const raw = el.getAttribute(attr);
    if (!raw) return;
    const resolved = resolveDocLink(raw, sourcePath);
    switch (resolved.kind) {
      case "slug": {
        const slug = resolved.slug ?? "";
        const target = slug ? `${langRoot}${slug}/` : langRoot;
        el.setAttribute(attr, `${target}${resolved.hash ?? ""}`);
        break;
      }
      case "asset": {
        el.setAttribute(
          attr,
          `${langRoot}${resolved.assetPath}${resolved.hash ?? ""}`,
        );
        break;
      }
      case "search": {
        el.setAttribute(attr, `${langRoot}search.html${resolved.hash ?? ""}`);
        break;
      }
      case "genindex": {
        el.setAttribute(attr, `${langRoot}genindex.html${resolved.hash ?? ""}`);
        break;
      }
      default:
        // external / fragment / site-absolute: leave alone
        break;
    }
  };

  root.querySelectorAll("a[href]").forEach((a) => rewriteAttr(a, "href"));
  root.querySelectorAll("img[src]").forEach((img) => rewriteAttr(img, "src"));
  root.querySelectorAll("source[src]").forEach((s) => rewriteAttr(s, "src"));
  root.querySelectorAll("video[src]").forEach((v) => rewriteAttr(v, "src"));
  root.querySelectorAll("audio[src]").forEach((a) => rewriteAttr(a, "src"));

  // Mark external links so we can style and open them appropriately.
  root.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (/^https?:\/\//i.test(href)) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/** Extract the on-this-page TOC from a parsed Sphinx article. */
function extractPageToc(doc: HTMLElement): DocPageTocItem[] {
  const nav = doc.querySelector("nav.bd-toc-nav.page-toc");
  if (!nav) return [];

  const parseList = (ul: HTMLElement | null, level: number): DocPageTocItem[] => {
    if (!ul) return [];
    const out: DocPageTocItem[] = [];
    ul.childNodes.forEach((li) => {
      const liEl = li as HTMLElement;
      if (liEl.tagName !== "LI") return;
      const a = liEl.querySelector("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const nested = liEl.querySelector("ul");
      out.push({
        href,
        label: a.text.trim(),
        level,
        children: nested ? parseList(nested, level + 1) : undefined,
      });
    });
    return out;
  };

  const topUl = nav.querySelector("ul");
  return parseList(topUl, 2);
}

/** Extract prev/next nav from <link rel> pairs. */
function extractPrevNext(
  doc: HTMLElement,
  sourcePath: string,
  _lang: Lang,
): { prev: DocPrevNext | null; next: DocPrevNext | null } {
  const read = (rel: "prev" | "next"): DocPrevNext | null => {
    const link = doc.querySelector(`link[rel="${rel}"]`);
    if (!link) return null;
    const href = link.getAttribute("href") ?? "";
    const title = link.getAttribute("title") ?? "";
    if (!href || !title) return null;
    const resolved = resolveDocLink(href, sourcePath);
    if (resolved.kind !== "slug") return null;
    return { href: resolved.slug ?? "", title };
  };
  return { prev: read("prev"), next: read("next") };
}

/** Extract the sphinx-thebe config from the article's <script> tags. */
function extractThebeConfig(root: HTMLElement): {
  thebeConfig: string | null;
  kernelPath: string | null;
} {
  const scripts = root.querySelectorAll("script");
  let thebeConfig: string | null = null;
  let kernelPath: string | null = null;
  scripts.forEach((s) => {
    const type = s.getAttribute("type") ?? "";
    if (type === "text/x-thebe-config") {
      thebeConfig = s.innerHTML.trim();
      const m = /path:\s*"([^"]*)"/.exec(thebeConfig);
      if (m) kernelPath = m[1];
      s.remove();
    }
  });
  return { thebeConfig, kernelPath };
}

/** Parse one Jupyter Book article HTML file into a DocPage. */
export function extractPage(
  lang: Lang,
  sourcePath: string, // relative to docs/{lang}/
  baseUrl: string,
): DocPage | null {
  const absPath = path.join(DOCS_PUBLIC_DIR, lang, sourcePath);
  if (!fs.existsSync(absPath)) return null;

  const html = fs.readFileSync(absPath, "utf-8");
  const doc = parse(html, {
    blockTextElements: { script: true, style: true, pre: true, code: true },
  });

  const article = doc.querySelector("article.bd-article");
  if (!article) return null;

  // Title — prefer the page's <h1>, fall back to <title>.
  const h1 = article.querySelector("h1");
  let title = h1 ? h1.text.replace(/#$/, "").trim() : "";
  if (!title) {
    const titleEl = doc.querySelector("title");
    title = titleEl
      ? titleEl.text
          .replace(/&#8212;.*$/, "")
          .replace(/—.*$/, "")
          .trim()
      : sourcePath;
  }

  const pageToc = extractPageToc(doc);
  const { prev, next } = extractPrevNext(doc, sourcePath, lang);
  const { thebeConfig, kernelPath } = extractThebeConfig(article);

  stripDecorations(article);
  rewriteUrls(article, sourcePath, lang, baseUrl);

  // Drop the Sphinx-generated search box artifact if it slipped in.
  article.querySelectorAll("#searchbox").forEach((el) => el.remove());

  const bodyHtml = article.toString();

  return {
    lang,
    slug: slugFromSourcePath(sourcePath),
    sourcePath,
    title,
    bodyHtml,
    pageToc,
    prev,
    next,
    thebeConfig,
    kernelPath,
  };
}

/** Extract the primary sidebar tree from the pre-rendered Sphinx HTML. */
export function extractSidebar(
  lang: Lang,
  rootSourcePath: string, // e.g. "src/index.html"
  baseUrl: string,
): DocSidebarSection[] {
  const absPath = path.join(DOCS_PUBLIC_DIR, lang, rootSourcePath);
  if (!fs.existsSync(absPath)) return [];

  const html = fs.readFileSync(absPath, "utf-8");
  const doc = parse(html);
  const navRoot = doc.querySelector("nav.bd-links.bd-docs-nav");
  if (!navRoot) return [];

  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const langRoot = `${base}docs/${lang}/`;

  const parseList = (ul: HTMLElement): DocTocEntry[] => {
    const entries: DocTocEntry[] = [];
    ul.childNodes.forEach((node) => {
      const li = node as HTMLElement;
      if (!li || li.tagName !== "LI") return;
      const anchor = li.querySelector("a.reference.internal");
      if (!anchor) return;
      const rawHref = anchor.getAttribute("href") ?? "";
      const resolved = resolveDocLink(rawHref, rootSourcePath);
      const href =
        resolved.kind === "slug"
          ? resolved.slug
            ? `${langRoot}${resolved.slug}/`
            : langRoot
          : resolved.href ?? rawHref;
      const nestedUl = li.querySelector("details ul") ?? li.querySelector("ul");
      const children = nestedUl ? parseList(nestedUl) : undefined;
      entries.push({
        href,
        label: anchor.text.trim(),
        children,
      });
    });
    return entries;
  };

  const sections: DocSidebarSection[] = [];
  const children = navRoot.querySelector(".bd-toc-item");
  const container = children ?? navRoot;
  const captions = container.querySelectorAll(":scope > p.caption");

  // Standalone home-link list at the top (no caption).
  const homeList = container.querySelector(":scope > ul.bd-sidenav__home-link");
  if (homeList) {
    sections.push({ items: parseList(homeList) });
  }

  if (captions.length === 0) {
    // No grouped captions — flat list after home.
    const flatLists = container
      .querySelectorAll(":scope > ul.bd-sidenav")
      .filter((ul) => ul !== homeList);
    flatLists.forEach((ul) => {
      sections.push({ items: parseList(ul) });
    });
    return sections;
  }

  // Walk children sequentially: each caption is followed by its `ul.bd-sidenav`.
  const kids = container.childNodes.filter(
    (n): n is HTMLElement => (n as HTMLElement).tagName !== undefined,
  );
  for (let i = 0; i < kids.length; i++) {
    const el = kids[i];
    if (el.tagName === "P" && el.classList.contains("caption")) {
      const captionText =
        el.querySelector(".caption-text")?.text.trim() ?? el.text.trim();
      const nextUl = kids
        .slice(i + 1)
        .find(
          (k) => k.tagName === "UL" && k.classList.contains("bd-sidenav"),
        ) as HTMLElement | undefined;
      if (nextUl) {
        sections.push({ caption: captionText, items: parseList(nextUl) });
      }
    }
  }

  return sections;
}
