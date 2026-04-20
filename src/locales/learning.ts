import type { Lang } from "../config/i18n";

export type LearningCardItem = {
  title: string;
  description: string;
  href: string;
};

export type LearningSidebarItem = { label: string; href: string };

export type LearningMessages = {
  metaDescription: string;
  title: string;
  eyebrow: string;
  sidebar: {
    sectionTitle: string;
    tabs: LearningSidebarItem[];
    tutorials: LearningSidebarItem[];
  };
  cards: LearningCardItem[];
  searchPlaceholder: string;
  downloadLabel: string;
};

export const LEARNING_MESSAGES: Record<Lang, LearningMessages> = {
  en: {
    metaDescription:
      "MindQuantum learning resources: courses, video tutorials, papers, and reference code.",
    title: "MindSpore Quantum Courses",
    eyebrow: "Learning",
    sidebar: {
      sectionTitle: "Learning",
      tabs: [
        { label: "Courses", href: "/learning/" },
        { label: "Video Courses", href: "/courses/" },
        { label: "White Paper", href: "/documentation/" },
        { label: "Paper Code", href: "/community/" },
      ],
      tutorials: [
        {
          label: "Quantum Computing Fundamentals Course",
          href: "/courses/",
        },
        { label: "Beginner Tutorial", href: "/docs/en/" },
        { label: "Middle Level Tutorial", href: "/docs/en/" },
        { label: "Advanced Tutorial", href: "/docs/en/" },
      ],
    },
    cards: [
      {
        title: "Quantum Computing Fundamentals Course",
        description:
          "This part of the course focuses on mastering the theoretical foundations of quantum information and computation.",
        href: "/courses/",
      },
      {
        title: "Beginner Tutorial",
        description:
          "Understand the basic components of MindSpore Quantum, including quantum gates, quantum circuits, hamiltonian, and the usage of quantum simulators.",
        href: "/docs/en/",
      },
      {
        title: "Middle Level Tutorial",
        description:
          "Understand the applications of MindSpore Quantum in noisy quantum simulation, quantum circuit compilation, qubit mapping, and other scenarios that are closer to real quantum chip environments.",
        href: "/docs/en/",
      },
      {
        title: "Advanced Tutorial",
        description:
          "Understand the design and usage of MindSpore Quantum for NISQ algorithms, particularly how to design variational quantum algorithms and collaborate with MindSpore to train hybrid quantum-classical algorithms.",
        href: "/docs/en/",
      },
    ],
    searchPlaceholder: "Search in Docs",
    downloadLabel: "Download",
  },
  zh: {
    metaDescription: "MindQuantum 学习资源：课程、视频教程、论文与参考代码。",
    title: "MindSpore Quantum 课程",
    eyebrow: "学习",
    sidebar: {
      sectionTitle: "学习",
      tabs: [
        { label: "课程", href: "/zh/learning/" },
        { label: "视频课程", href: "/courses/" },
        { label: "白皮书", href: "/zh/documentation/" },
        { label: "论文代码", href: "/zh/community/" },
      ],
      tutorials: [
        { label: "量子计算基础课", href: "/courses/" },
        { label: "初级教程", href: "/docs/zh/" },
        { label: "中级教程", href: "/docs/zh/" },
        { label: "高级教程", href: "/docs/zh/" },
      ],
    },
    cards: [
      {
        title: "量子计算基础课",
        description: "本部分课程聚焦于掌握量子信息与量子计算的理论基础。",
        href: "/courses/",
      },
      {
        title: "初级教程",
        description:
          "了解 MindSpore Quantum 的基本组件，包括量子门、量子电路、哈密顿量，以及量子模拟器的使用。",
        href: "/docs/zh/",
      },
      {
        title: "中级教程",
        description:
          "了解 MindSpore Quantum 在噪声量子模拟、量子电路编译、量子比特映射等更贴近真实量子芯片场景中的应用。",
        href: "/docs/zh/",
      },
      {
        title: "高级教程",
        description:
          "了解 MindSpore Quantum 面向 NISQ 算法的设计与使用，特别是变分量子算法设计以及与 MindSpore 配合训练混合量子-经典算法。",
        href: "/docs/zh/",
      },
    ],
    searchPlaceholder: "搜索文档",
    downloadLabel: "下载",
  },
};
