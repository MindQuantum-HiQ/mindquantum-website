import type { Lang } from "../config/i18n";

export type DocSection = {
  title: string;
  description: string;
  href: string;
};

export type DocumentationMessages = {
  metaDescription: string;
  eyebrow: string;
  title: string;
  sidebar: Array<{ label: string; href: string }>;
  sections: DocSection[];
  searchPlaceholder: string;
  downloadLabel: string;
  nextLabel: string;
};

export const DOCUMENTATION_MESSAGES: Record<Lang, DocumentationMessages> = {
  en: {
    metaDescription:
      "MindQuantum documentation — installation guide, case library, API reference, release notes and more.",
    eyebrow: "MindSpore Quantum Documentation",
    title: "MindSpore Quantum Documentation",
    sidebar: [
      { label: "MindSpore Quantum Courses", href: "/learning/" },
      { label: "Quantum Computing Fundamentals Course", href: "/courses/" },
      { label: "Beginner Tutorial", href: "/docs/en/" },
      { label: "Middle Level Tutorial", href: "/docs/en/" },
      { label: "Advanced Tutorial", href: "/docs/en/" },
    ],
    sections: [
      {
        title: "Installation Guide",
        description:
          "Understand how to install MindSpore Quantum in different systems, or localize fast compilation and debugging of MindSpore Quantum as a developer.",
        href: "/docs/en/",
      },
      {
        title: "Case Library",
        description:
          "Comprehensive case tutorials in the field of universal quantum algorithms and variational quantum algorithms that can help you quickly get started in related research areas.",
        href: "/docs/en/",
      },
      {
        title: "API",
        description: "MindSpore Quantum API description list.",
        href: "/api/en/",
      },
      {
        title: "Paper with Code",
        description:
          "Open-source contributors and official reproduction code based on academic papers.",
        href: "/community/",
      },
      {
        title: "Release Notes",
        description:
          "Contains information on major features, augments, and API changes for the release versions.",
        href: "/docs/en/",
      },
    ],
    searchPlaceholder: "Search in Docs",
    downloadLabel: "Download",
    nextLabel: "Installation Guide",
  },
  zh: {
    metaDescription:
      "MindQuantum 文档 — 安装指南、案例库、API 参考、发行说明等。",
    eyebrow: "MindSpore Quantum 文档",
    title: "MindSpore Quantum 文档",
    sidebar: [
      { label: "MindSpore Quantum 课程", href: "/zh/learning/" },
      { label: "量子计算基础课", href: "/courses/" },
      { label: "初级教程", href: "/docs/zh/" },
      { label: "中级教程", href: "/docs/zh/" },
      { label: "高级教程", href: "/docs/zh/" },
    ],
    sections: [
      {
        title: "安装指南",
        description:
          "了解在不同系统中安装 MindSpore Quantum，或作为开发者快速完成本地编译与调试。",
        href: "/docs/zh/",
      },
      {
        title: "案例库",
        description:
          "通用量子算法与变分量子算法领域的全面案例教程，助你快速入门相关研究。",
        href: "/docs/zh/",
      },
      {
        title: "API",
        description: "MindSpore Quantum API 说明列表。",
        href: "/api/zh/",
      },
      {
        title: "带代码的论文",
        description: "基于学术论文的开源贡献与官方复现代码。",
        href: "/zh/community/",
      },
      {
        title: "发行说明",
        description: "包含每个版本的主要特性、增强与 API 变更信息。",
        href: "/docs/zh/",
      },
    ],
    searchPlaceholder: "搜索文档",
    downloadLabel: "下载",
    nextLabel: "安装指南",
  },
};
