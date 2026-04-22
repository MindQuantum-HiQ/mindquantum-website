import type { Lang } from "../config/i18n";

export type DocsMessages = {
  docsLabel: string; // "Documentation"
  tocHeading: string; // "On this page"
  searchPlaceholder: string;
  prev: string;
  next: string;
  sidebarToggle: string;
  sidebarClose: string;
  tocToggle: string;
  tocClose: string;
  backToHub: string; // link back to /documentation/
  editOnSource: string;
};

export const DOCS_MESSAGES: Record<Lang, DocsMessages> = {
  en: {
    docsLabel: "Documentation",
    tocHeading: "On this page",
    searchPlaceholder: "Search docs…",
    prev: "Previous",
    next: "Next",
    sidebarToggle: "Open navigation",
    sidebarClose: "Close navigation",
    tocToggle: "Contents",
    tocClose: "Close contents",
    backToHub: "All documentation",
    editOnSource: "View source",
  },
  zh: {
    docsLabel: "文档",
    tocHeading: "本页内容",
    searchPlaceholder: "搜索文档…",
    prev: "上一页",
    next: "下一页",
    sidebarToggle: "打开导航",
    sidebarClose: "关闭导航",
    tocToggle: "目录",
    tocClose: "关闭目录",
    backToHub: "返回文档首页",
    editOnSource: "查看源文件",
  },
};
