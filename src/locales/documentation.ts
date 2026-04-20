import type { Lang } from "../config/i18n";

export type DocSection = {
  title: string;
  description: string;
  href: string;
  meta?: string;
};

export type DocumentationMessages = {
  metaDescription: string;
  eyebrow: string;
  title: string;
  lede: string;
  sidebar: Array<{ label: string; href: string }>;
  sectionsHeading: string;
  sections: DocSection[];
  install: {
    command: string;
    meta: string;
    copyLabel: string;
    copiedLabel: string;
    manualLabel: string;
  };
  nextLabel: string;
};

export const DOCUMENTATION_MESSAGES: Record<Lang, DocumentationMessages> = {
  en: {
    metaDescription:
      "MindQuantum documentation — installation guide, case library, API reference, release notes and more.",
    eyebrow: "Documentation",
    title: "MindSpore Quantum Documentation",
    lede: "Install guides, tutorials, API reference, and release notes for MindSpore Quantum.",
    sidebar: [
      { label: "Overview", href: "/documentation/" },
      { label: "Installation Guide", href: "/docs/en/" },
      { label: "Case Library", href: "/docs/en/" },
      { label: "API Reference", href: "/api/en/" },
      { label: "Release Notes", href: "/docs/en/" },
    ],
    sectionsHeading: "Reference",
    sections: [
      {
        title: "Installation Guide",
        description:
          "Install MindSpore Quantum on Linux, macOS, or build it from source for development.",
        href: "/docs/en/",
        meta: "Jupyter Book",
      },
      {
        title: "Case Library",
        description:
          "End-to-end tutorials covering universal and variational quantum algorithms.",
        href: "/docs/en/",
        meta: "Jupyter Book",
      },
      {
        title: "API Reference",
        description: "Every module, class, and function in MindSpore Quantum.",
        href: "/api/en/",
        meta: "Sphinx",
      },
      {
        title: "Paper with Code",
        description:
          "Reproduction code and open-source contributions based on academic papers.",
        href: "/community/",
        meta: "Community",
      },
      {
        title: "Release Notes",
        description:
          "Major features, enhancements, and API changes for each release.",
        href: "/docs/en/",
        meta: "GitHub",
      },
    ],
    install: {
      command: "pip install mindquantum",
      meta: "Stable · Python 3.9+ · Linux / macOS / Windows (WSL)",
      copyLabel: "Copy",
      copiedLabel: "Copied",
      manualLabel: "Press \u2318C / Ctrl+C",
    },
    nextLabel: "Installation Guide",
  },
  zh: {
    metaDescription:
      "MindQuantum 文档 — 安装指南、案例库、API 参考、发行说明等。",
    eyebrow: "文档",
    title: "MindSpore Quantum 文档",
    lede: "MindSpore Quantum 的安装指南、教程、API 参考与发行说明。",
    sidebar: [
      { label: "概览", href: "/zh/documentation/" },
      { label: "安装指南", href: "/docs/zh/" },
      { label: "案例库", href: "/docs/zh/" },
      { label: "API 参考", href: "/api/zh/" },
      { label: "发行说明", href: "/docs/zh/" },
    ],
    sectionsHeading: "参考",
    sections: [
      {
        title: "安装指南",
        description: "在 Linux、macOS 或从源码安装 MindSpore Quantum。",
        href: "/docs/zh/",
        meta: "Jupyter Book",
      },
      {
        title: "案例库",
        description: "涵盖通用与变分量子算法的端到端教程。",
        href: "/docs/zh/",
        meta: "Jupyter Book",
      },
      {
        title: "API 参考",
        description: "MindSpore Quantum 的每个模块、类与函数说明。",
        href: "/api/zh/",
        meta: "Sphinx",
      },
      {
        title: "带代码的论文",
        description: "基于学术论文的开源贡献与官方复现代码。",
        href: "/zh/community/",
        meta: "社区",
      },
      {
        title: "发行说明",
        description: "每个版本的主要特性、增强与 API 变更。",
        href: "/docs/zh/",
        meta: "GitHub",
      },
    ],
    install: {
      command: "pip install mindquantum",
      meta: "稳定版 · Python 3.9+ · Linux / macOS / Windows (WSL)",
      copyLabel: "复制",
      copiedLabel: "已复制",
      manualLabel: "请按 \u2318C / Ctrl+C",
    },
    nextLabel: "安装指南",
  },
};
