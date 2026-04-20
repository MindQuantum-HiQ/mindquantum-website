import type { Lang } from "../config/i18n";

export type LearningCardItem = {
  title: string;
  description: string;
  href: string;
};

export type LearningMessages = {
  metaDescription: string;
  title: string;
  eyebrow: string;
  lede: string;
  prereqLabel: string;
  pathHeading: string;
  cards: LearningCardItem[];
  sideRail: {
    videoTitle: string;
    videoDescription: string;
    videoHref: string;
    videoLinkLabel: string;
    helpTitle: string;
    helpDescription: string;
    helpHref: string;
    helpLinkLabel: string;
  };
};

export const LEARNING_MESSAGES: Record<Lang, LearningMessages> = {
  en: {
    metaDescription:
      "MindQuantum learning resources: courses, video tutorials, papers, and reference code.",
    title: "Learn MindSpore Quantum",
    eyebrow: "Learning",
    lede: "A guided path from quantum computing fundamentals to variational algorithms — built for students new to quantum.",
    prereqLabel: "Start here",
    pathHeading: "Learning path",
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
          "Quantum gates, circuits, Hamiltonians, and the MindQuantum simulator — the primitives you'll use in every program.",
        href: "/docs/en/",
      },
      {
        title: "Middle Level Tutorial",
        description:
          "Noisy simulation, circuit compilation, and qubit mapping — scenarios that bring your code closer to real quantum hardware.",
        href: "/docs/en/",
      },
      {
        title: "Advanced Tutorial",
        description:
          "NISQ algorithms and variational quantum circuits, training hybrid quantum-classical models alongside MindSpore.",
        href: "/docs/en/",
      },
    ],
    sideRail: {
      videoTitle: "Video courses",
      videoDescription: "Watch the group-meeting recordings on Bilibili and Koushare.",
      videoHref: "/courses/",
      videoLinkLabel: "Watch video courses",
      helpTitle: "New here?",
      helpDescription: "Get the lay of the land before diving into a tutorial.",
      helpHref: "/",
      helpLinkLabel: "Read the overview",
    },
  },
  zh: {
    metaDescription: "MindQuantum 学习资源：课程、视频教程、论文与参考代码。",
    title: "学习 MindSpore Quantum",
    eyebrow: "学习",
    lede: "从量子计算基础到变分量子算法的完整学习路径 — 为初学者设计。",
    prereqLabel: "从这里开始",
    pathHeading: "学习路径",
    cards: [
      {
        title: "量子计算基础课",
        description: "本部分课程聚焦于掌握量子信息与量子计算的理论基础。",
        href: "/courses/",
      },
      {
        title: "初级教程",
        description: "量子门、量子电路、哈密顿量与 MindQuantum 模拟器——每个程序都会用到的基础组件。",
        href: "/docs/zh/",
      },
      {
        title: "中级教程",
        description: "噪声模拟、量子电路编译与量子比特映射——让代码更贴近真实量子硬件的场景。",
        href: "/docs/zh/",
      },
      {
        title: "高级教程",
        description: "NISQ 算法与变分量子电路，以及与 MindSpore 协同训练混合量子-经典模型。",
        href: "/docs/zh/",
      },
    ],
    sideRail: {
      videoTitle: "视频课程",
      videoDescription: "在 B 站或蔻享观看组会录播。",
      videoHref: "/courses/",
      videoLinkLabel: "观看视频课程",
      helpTitle: "初次访问？",
      helpDescription: "先快速了解一下 MindSpore Quantum 再深入教程。",
      helpHref: "/zh/",
      helpLinkLabel: "阅读简介",
    },
  },
};
